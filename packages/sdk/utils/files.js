import { parseBufferList } from '@nearform/observer-data'
import { BufferList } from 'bl'

function uploadDataFile(file, onUploadStart, onUploadFinished, onUploadChunk) {
  if (!file) return

  const name = file.name

  const blobSlice = Blob.prototype.slice
  const versionFieldSize = 4
  const chunkSize = 1000 * 1024
  const chunks = Math.ceil((file.size - versionFieldSize) / chunkSize)
  const reader = new FileReader()
  const bl = new BufferList()
  const eventsBuffer = []

  let currentChunk = 0
  let eventsRelease = false

  setInterval(() => {
    eventsRelease = true
  }, 1000)

  reader.onload = e => {
    if (currentChunk <= chunks) {
      const buf = Buffer.from(event.currentTarget.result)
      if (currentChunk > 0) {
        bl.append(buf)
        processUploadBuffer({
          bufferList: bl,
          eventsBuffer,
          eventsRelease,
          onUploadChunk,
        })
        eventsRelease = false
      }
      const start = versionFieldSize + currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      reader.readAsArrayBuffer(blobSlice.call(file, start, end))
      currentChunk++
    } else {
      if (onUploadFinished) onUploadFinished(name)
    }
  }
  reader.readAsArrayBuffer(blobSlice.call(file, 0, versionFieldSize))
  if (onUploadStart) onUploadStart(name)
}

async function applySampleData(
  samplePath,
  onUploadStart,
  onUploadFinished,
  onUploadChunk = () => {}
) {
  const name = samplePath.match(/[/|\\]?([^/|\\]*)$/)[1]

  if (onUploadStart) onUploadStart(name)

  const bl = new BufferList()
  const response = await fetch(samplePath)

  if (!response.ok) {
    const { status, statusText, url } = response
    throw new Error(`${status} "${statusText}" fetching data from ${url}`)
  }

  const arrbuf = await response.arrayBuffer()

  const buf = Buffer.from(arrbuf)
  bl.append(buf.slice(4))
  processUploadBuffer({
    bufferList: bl,
    onUploadChunk,
  })

  onUploadFinished(name)
}

function processUploadBuffer({ bufferList, onUploadChunk }) {
  const data = parseBufferList(bufferList)
  onUploadChunk(data)
}

export { uploadDataFile, applySampleData }
