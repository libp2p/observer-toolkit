import { parseBufferList } from '@nearform/observer-data'
import { proto } from '@nearform/observer-proto'
import { BufferList } from 'bl'

let eventsRelease = false

setInterval(() => {
  eventsRelease = true
}, 200)

// Give each command a unique integer id
let id = 0

function createClientCommandMessage(command, { config, source } = {}) {
  if (command === undefined) throw new Error('ClientCommand requires a command')

  id++
  const clientCommand = new proto.ClientCommand()
  clientCommand.setId(id)
  clientCommand.setVersion(new proto.Version(1))
  clientCommand.setCommand(command)
  clientCommand.setSource(source)
  if (config) clientCommand.setConfig(createConfiguration(config))
  return clientCommand
}

function createConfiguration({ stateSnapshotIntervalMs, retentionPeriodMs }) {
  const configMessage = new proto.Configuration()
  configMessage.setStateSnapshotIntervalMs(stateSnapshotIntervalMs)
  configMessage.setRetentionPeriodMs(retentionPeriodMs)
  return configMessage
}

function getMessageDataBuffer(msg, done) {
  if (msg.data instanceof Blob) {
    const fileReader = new FileReader()
    fileReader.onload = function(event) {
      const buf = new Uint8Array(event.target.result)
      done(buf)
    }
    fileReader.readAsArrayBuffer(msg.data)
  } else {
    done(new Buffer(msg.data, 'binary'))
  }
}

function getCommand(cmd) {
  if (cmd === 'hello') return proto.ClientCommand.Command.HELLO
  if (cmd === 'request') return proto.ClientCommand.Command.REQUEST
  if (cmd === 'start') return proto.ClientCommand.Command.PUSH_ENABLE
  if (cmd === 'stop') return proto.ClientCommand.Command.PUSH_DISABLE
  if (cmd === 'pause') return proto.ClientCommand.Command.PUSH_PAUSE
  if (cmd === 'resume') return proto.ClientCommand.Command.PUSH_RESUME
  if (cmd === 'config') return proto.ClientCommand.Command.UPDATE_CONFIG
  throw new Error(`Unrecognised command type "${cmd}"`)
}

function sendWsCommand(ws, dispatchWebsocket, cmd, props, callback) {
  const command = getCommand(cmd)

  const commandMessage = createClientCommandMessage(command, props)
  const commandId = commandMessage.getId()
  const data = commandMessage.serializeBinary()

  if (callback) {
    dispatchWebsocket({
      action: 'attachCallback',
      commandId,
      callback,
    })
  }

  if (!data) throw new Error(`No command data from command "${cmd}"`)
  ws.send(data)
}

function uploadWebSocket(
  url,
  onUploadStart,
  onUploadFinished,
  onUploadChunk,
  dispatchWebsocket
) {
  const bl = new BufferList()
  const eventsBuffer = []
  const usePushEmitter = true

  if (!url) return
  const ws = new WebSocket(url)
  const sendCommand = (...args) => sendWsCommand(ws, dispatchWebsocket, ...args)

  ws.addEventListener('error', function(evt) {
    console.error('WebSocket Error', evt)
  })
  ws.addEventListener('message', function(msg) {
    // process incoming message
    if (msg.data) {
      getMessageDataBuffer(msg, buf => {
        bl.append(buf.slice(4))
        processUploadBuffer({
          bufferList: bl,
          eventsBuffer,
          onUploadChunk,
        })
      })

      dispatchWebsocket({
        action: 'onData',
        callback: onUploadFinished(url),
      })
    }

    if (!usePushEmitter) {
      // request data manually
      setTimeout(() => {
        sendCommand('data')
      }, 1000)
    }
  })
  ws.addEventListener('close', function(evt) {
    dispatchWebsocket({ action: 'onClose' })
    if (!evt.wasClean) {
      console.error(
        `WebSocket close was not clean (code: ${evt.code} / reason: "${evt.reason}")`
      )
    }
  })
  ws.addEventListener('open', function() {
    if (onUploadStart) onUploadStart(url)
    dispatchWebsocket({
      action: 'onOpen',
      ws,
      sendCommand,
    })

    const callback = () => {
      sendCommand('request', { source: proto.ClientCommand.Source.RUNTIME })
      sendCommand('start', { source: proto.ClientCommand.Source.EVENTS })
      if (usePushEmitter) {
        sendCommand('start', { source: proto.ClientCommand.Source.STATE })
      } else {
        sendCommand('request', { source: proto.ClientCommand.Source.STATE })
      }
    }

    sendCommand('hello', undefined, callback)
  })
}

function processUploadBuffer({ bufferList, eventsBuffer, onUploadChunk }) {
  const data = parseBufferList(bufferList)
  const events = data.events || []
  eventsBuffer.push(...events)
  if (eventsRelease) {
    onUploadChunk({
      ...data,
      events: [...eventsBuffer],
    })
    eventsBuffer.length = 0
    eventsRelease = false
  } else {
    onUploadChunk({
      ...data,
      events: [],
    })
  }
}

export { sendWsCommand, uploadWebSocket }
