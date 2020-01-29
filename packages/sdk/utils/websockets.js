import { parseBufferList } from '@libp2p-observer/data'
import { BufferList } from 'bl'

function uploadWebSocket(url, onUploadStart, onUploadFinished, onUploadChunk) {
  const bl = new BufferList()

  if (!url) return

  const ws = new WebSocket(url)
  ws.addEventListener('message', function(msg) {
    const metadata = { type: 'live', name: url }
    if (msg.data) {
      const buf = new Buffer(msg.data, 'binary')
      bl.append(buf.slice(4))
      processUploadBuffer(bl, onUploadChunk, metadata)
    }
    setTimeout(() => {
      ws.send('ready')
    }, 1000)
  })
  ws.addEventListener('close', function() {
    if (onUploadFinished) onUploadFinished(url)
  })
  ws.addEventListener('open', function() {
    if (onUploadStart) onUploadStart(url)
  })
}

function processUploadBuffer(bufferList, onUploadChunk, metadata) {
  const data = parseBufferList(bufferList)
  if (metadata && data.states) data.states.metadata = metadata
  onUploadChunk(data)
}

export { uploadWebSocket }
