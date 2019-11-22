import { parseArrayBuffer } from '@libp2p-observer/data'
import samples from '@libp2p-observer/samples'

function uploadDataFile(file, onUploadStart, onDataLoaded) {
  if (!file) return
  const reader = new FileReader()

  // TODO: On integration with live output, share logic parsing file chunk by chunk
  reader.onload = e =>
    processUploadedData(event.currentTarget.result, file, onDataLoaded)
  reader.readAsArrayBuffer(file)
  if (onUploadStart) onUploadStart(file)
}

async function applySampleData(sampleIndex, onUploadStart, onDataLoaded) {
  if (onUploadStart) onUploadStart()

  const filePath = samples[sampleIndex]

  const response = await fetch(filePath)

  if (!response.ok) {
    const { status, statusText, url } = response
    throw new Error(`${status} "${statusText}" fetching data from ${url}`)
  }

  const arrbuf = await response.arrayBuffer()
  processUploadedData(arrbuf, response, onDataLoaded)
}

function processUploadedData(arrayBuf, file, onDataLoaded) {
  const data = parseArrayBuffer(arrayBuf)
  if (onDataLoaded) onDataLoaded(data, file)
}

export { uploadDataFile, processUploadedData, applySampleData }
