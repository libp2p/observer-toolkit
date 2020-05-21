import { parseImport } from '@nearform/observer-data'

const defaultFilename = 'sample-1min.mock'

// Only to be used in node env like Jest where node modules are available
function loadSample(filename = defaultFilename) {
  const { readFileSync } = require('fs')
  const path = require('path')

  // Avoid needing webpack file loader and build - make direct path
  const samplesPath = require.resolve('@nearform/observer-samples')
  const sampleFilePath = path.resolve(
    path.dirname(samplesPath),
    'samples',
    filename
  )
  const sampleData = parseImport(readFileSync(sampleFilePath))

  const source = {
    type: 'sample',
    name: 'Test sample data',
  }

  return {
    data: sampleData,
    source,
  }
}

export default loadSample
