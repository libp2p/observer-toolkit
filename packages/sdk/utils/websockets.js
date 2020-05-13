import { parseBufferList } from '@nearform/observer-data'
import { proto } from '@nearform/observer-proto'
import { BufferList } from 'bl'

let eventsRelease = false

setInterval(() => {
  eventsRelease = true
}, 200)

function createClientSignalMessage(
  signal,
  content = {},
  datasource = proto.ClientSignal.DataSource.STATE
) {
  if (!signal) return
  const clientSignal = new proto.ClientSignal()
  clientSignal.setVersion(new proto.Version(1))
  clientSignal.setSignal(signal)
  clientSignal.setContent(JSON.stringify(content))
  clientSignal.setDataSource(datasource)
  return clientSignal.serializeBinary()
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

function getSignal(cmd) {
  if (cmd === 'data') return proto.ClientSignal.Signal.SEND_DATA
  if (cmd === 'pause') return proto.ClientSignal.Signal.PAUSE_PUSH_EMITTER
  if (cmd === 'unpause') return proto.ClientSignal.Signal.UNPAUSE_PUSH_EMITTER
  if (cmd === 'config') return proto.ClientSignal.Signal.CONFIG_EMITTER
  throw new Error(`Unrecognised signal type "${cmd}"`)
}

function sendWsSignal(ws, cmd, content) {
  const signal = getSignal(cmd)
  const data = createClientSignalMessage(signal, content)

  if (!data)
    throw new Error(
      `No signal data from command "${cmd}" with content "${content}"`
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
  const sendSignal = (...args) => sendWsSignal(ws, ...args)

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
        sendSignal('data')
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
      sendSignal,
    })
    if (!usePushEmitter) sendSignal('data')
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

export { sendWsSignal, uploadWebSocket }
