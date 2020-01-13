import {
  parseArrayBuffer,
  validateMessageChecksum,
} from '@libp2p-observer/data'
import { BufferList } from 'bl'

function uploadDataFile(file, onUploadStart, onUploadFinished, onUploadChunk) {
  if (!file) return

  const blobSlice = Blob.prototype.slice
  const versionFieldSize = 4
  const chunkSize = 10 * 1024
  const chunks = Math.ceil((file.size - versionFieldSize) / chunkSize)
  const reader = new FileReader()

  let currentChunk = 0
  let version = 0
  let bl = new BufferList()

  reader.onload = e => {
    const metadata = { type: 'upload', name: file.name }
    if (currentChunk <= chunks) {
      const buf = Buffer.from(event.currentTarget.result)
      if (currentChunk === 0) {
        version = buf.readUIntLE(0, 4)
      } else {
        bl.append(buf)
        bl = processUploadBuffer(version, bl, onUploadChunk)
      }
      const start = versionFieldSize + currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      reader.readAsArrayBuffer(blobSlice.call(file, start, end))
      currentChunk++
    } else {
      if (onUploadFinished) onUploadFinished(file)
    }
    // processUploadedData(
    //   event.currentTarget.result,
    //   file,
    //   onDataLoaded,
    //   metadata
    // )
  }
  reader.readAsArrayBuffer(blobSlice.call(file, 0, versionFieldSize))
  if (onUploadStart) onUploadStart(file)
}

async function applySampleData(samplePath, onUploadStart, onDataLoaded) {
  if (onUploadStart) onUploadStart()

  const response = await fetch(samplePath)

  if (!response.ok) {
    const { status, statusText, url } = response
    throw new Error(`${status} "${statusText}" fetching data from ${url}`)
  }

  const arrbuf = await response.arrayBuffer()

  const metadata = {
    type: 'sample',
    name: 'Sample data',
  }

  processUploadedData(arrbuf, response, onDataLoaded, metadata)
}

function processUploadBuffer(version, bufferList, onUploadChunk) {
  const messageChecksumLength = 4
  const messageSizeLength = 4

  while (bufferList.length > messageChecksumLength + messageSizeLength) {
    const messageChecksum = bufferList.readUIntLE(0, messageChecksumLength)
    const messageSize = bufferList.readUIntLE(4, messageSizeLength)
    const minimalBufferLength =
      messageChecksumLength + messageSizeLength + messageSize
    if (bufferList.length <= minimalBufferLength) break
    const messageBuffer = new Buffer(messageSize) // bufferList.slice(8, messageSize)
    bufferList.copy(messageBuffer, 0, 8, messageSize)
    const calcChecksum = getMessageChecksum(messageBuffer)
    const valie = messageChecksum === calcChecksum
    bufferList = bufferList.shallowSlice(minimalBufferLength)
  }
  return bufferList
}

function processUploadedData(arrayBuf, file, onDataLoaded, metadata) {
  //const data = parseArrayBuffer(arrayBuf)
  // console.log(data)
  // if (metadata && data.states) data.states.metadata = metadata
  // if (onDataLoaded) onDataLoaded(data, file)
}

export { uploadDataFile, applySampleData }
