import { parseArrayBuffer } from '@libp2p-observer/data'

function uploadDataFile(file, onUploadStart, onDataLoaded) {
  if (!file) return
  const reader = new FileReader()

  // TODO: On integration with live output, share logic parsing file chunk by chunk
  reader.onload = e => {
    const metadata = {
      type: 'upload',
      name: file.name,
    }

    processUploadedData(
      event.currentTarget.result,
      file,
      onDataLoaded,
      metadata
    )
  }

  reader.readAsArrayBuffer(file)
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

function processUploadedData(arrayBuf, file, onDataLoaded, metadata) {
  const data = parseArrayBuffer(arrayBuf)

  if (metadata) data.metadata = metadata

  if (onDataLoaded) onDataLoaded(data, file)
}

export { uploadDataFile, processUploadedData, applySampleData }
