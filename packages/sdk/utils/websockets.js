import { parseBufferList } from '@libp2p-observer/data'
import { proto } from '@libp2p-observer/proto'
import { BufferList } from 'bl'

let ws = null

function createClientSignalMessage(
  signal,
  datasource = proto.ClientSignal.DataSource.STATE
) {
  const clientSignal = new proto.ClientSignal()
  clientSignal.setVersion(new proto.Version(1))
  clientSignal.setSignal(signal)
  clientSignal.setDataSource(datasource)
  return clientSignal.serializeBinary()
}

function sendSignal(type) {
  const data = createClientSignalMessage(type)
  if (ws) {
    ws.send(data)
  }
}

function uploadWebSocket(url, onUploadStart, onUploadFinished, onUploadChunk) {
  const bl = new BufferList()
  const usePushEmitter = true

  if (!url) return
  ws = new WebSocket(url)

  ws.addEventListener('message', function(msg) {
    // process incoming message
    const metadata = { type: 'live', name: url }
    if (msg.data) {
      const buf = new Buffer(msg.data, 'binary')
      bl.append(buf.slice(4))
      processUploadBuffer(bl, onUploadChunk, metadata)
    }

    if (!usePushEmitter) {
      // request data manually
      setTimeout(() => {
        sendSignal(proto.ClientSignal.Signal.SEND_DATA)
      }, 1000)
    }
  })
  ws.addEventListener('close', function() {
    if (onUploadFinished) onUploadFinished(url)
  })
  ws.addEventListener('open', function() {
    if (onUploadStart) onUploadStart(url)
    if (usePushEmitter) {
      sendSignal(proto.ClientSignal.Signal.START_PUSH_EMITTER)
    } else {
      sendSignal(proto.ClientSignal.Signal.SEND_DATA)
    }
  })
}

function processUploadBuffer(bufferList, onUploadChunk, metadata) {
  const data = parseBufferList(bufferList)
  if (metadata && data.states) data.states.metadata = metadata
  onUploadChunk(data)
}

export { sendSignal, uploadWebSocket }
