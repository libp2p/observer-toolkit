import { parseImport } from '@libp2p-observer/data'

const defaultFilename = 'sample-1min.mock'

async function fetchSample(filename = defaultFilename) {
  // Only to be used in browser environment where fetch is available
  if (typeof fetch !== 'function')
    throw new Error('fetchSample() requires the browser fetch() API')

  const { default: samples } = await import('@libp2p-observer/samples')
  const samplePath = samples.find(path => path.includes(filename))
  const response = await fetch(samplePath)
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
