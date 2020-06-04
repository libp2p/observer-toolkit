import { parseBufferList } from '@nearform/observer-data'
import { proto } from '@nearform/observer-proto'
import { BufferList } from 'bl'

let eventsRelease = false

setInterval(() => {
  eventsRelease = true
}, 200)

function createClientCommandMessage(
  command,
  content = {},
  datasource = proto.ClientCommand.Source.STATE
) {
  if (!command) return
  const clientCommand = new proto.ClientCommand()
  clientCommand.setVersion(new proto.Version(1))
  clientCommand.setCommand(command)
  clientCommand.setContent(JSON.stringify(content))
  clientCommand.setSource(datasource)
  return clientCommand.serializeBinary()
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
  if (cmd === 'data') return proto.ClientCommand.Command.SEND_DATA
  if (cmd === 'pause') return proto.ClientCommand.Command.PAUSE_PUSH
  if (cmd === 'resume') return proto.ClientCommand.Command.RESUME_PUSH
  if (cmd === 'config') return proto.ClientCommand.Command.UPDATE_CONFIG
  throw new Error(`Unrecognised command type "${cmd}"`)
}

function sendWsCommand(ws, cmd, content) {
  const command = getCommand(cmd)
  const data = createClientCommandMessage(command, content)

  if (!data)
    throw new Error(
      `No command data from command "${cmd}" with content "${content}"`
    )
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
  const sendCommand = (...args) => sendWsCommand(ws, ...args)

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
    if (!usePushEmitter) sendCommand('data')
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
