import { parseBufferList } from '@libp2p-observer/data'
// import { BufferList } from 'bl'

function uploadWebSocket(file, onUploadStart, onUploadFinished) {
  // if (!file) return
  // const reader = new FileReader()
  // // TODO: On integration with live output, share logic parsing file chunk by chunk
  // reader.onload = e => {
  //   const metadata = {
  //     type: 'upload',
  //     name: file.name,
  //   }
  //   processUploadedData(
  //     event.currentTarget.result,
  //     file,
  //     onDataLoaded,
  //     metadata
  //   )
  // }
  // reader.readAsArrayBuffer(file)
  // if (onUploadStart) onUploadStart(file)
}

function processUploadedBuffer(bufferList, onUploadChunk, metadata) {
  const data = parseBufferList(bufferList)
  if (metadata && data.states) data.states.metadata = metadata
  onUploadChunk(data)
}

export { uploadWebSocket }
