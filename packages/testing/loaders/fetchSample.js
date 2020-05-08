import { parseImport } from '@libp2p/observer-data'

async function fetchSample(sampleIndex = 0) {
  // Only to be used in browser environment where fetch is available
  if (typeof fetch !== 'function')
    throw new Error('fetchSample() requires the browser fetch() API')

  const { default: samples } = await import('@libp2p/observer-samples')
  const sample = samples[sampleIndex]

  const response = await fetch(sample.file)

  if (!response.ok) {
    const { status, statusText, url } = response
    throw new Error(`${status} "${statusText}" fetching data from ${url}`)
  }

  const fileData = await response.arrayBuffer()

  const sampleData = parseImport(fileData)

  const source = {
    type: 'sample',
    name: 'Demo sample data',
  }

  return {
    data: sampleData,
    source,
  }
}

export default fetchSample
