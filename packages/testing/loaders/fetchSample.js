import { parseImport } from '@libp2p-observer/data'

const defaultFilename = 'sample-1min.mock'

async function fetchSample(filename = defaultFilename) {
  // Only to be used in browser environment where fetch is available
  if (typeof fetch !== 'function')
    throw new Error('fetchSample() requires the browser fetch() API')

  const { default: samples } = await import('@libp2p-observer/samples')
  const sample = samples.find(({ file }) => file.includes(filename))
  const response = await fetch(sample.file)

  if (!response.ok) {
    const { status, statusText, url } = response
    throw new Error(`${status} "${statusText}" fetching data from ${url}`)
  }

  const fileData = await response.arrayBuffer()

  const sampleData = parseImport(fileData)

  if (sampleData.states) {
    sampleData.states.metadata = {
      type: 'sample',
      name: 'Demo sample data',
    }
  }

  return sampleData
}

export default fetchSample
