'use strict'

const { argv } = require('yargs').options({
  c: {
    alias: 'connections',
    describe: 'number of connections at start of simulation',
    type: 'number',
  },
  d: {
    alias: 'duration',
    describe: 'number of seconds of data collection to simulate',
    type: 'number',
  },
  f: {
    alias: 'file',
    describe:
      'path to write output. If ommitted, `mock` script writes to stdout, `mock-file` script writes to `mock-${Date.now()}`.',
    type: 'string',
  },
  s: {
    alias: 'streams',
    describe: 'number of streams per typical simulated connection',
    type: 'number',
  },
})
const { createWriteStream } = require('fs')

const {
  DEFAULT_CONNECTIONS,
  DEFAULT_DURATION,
  DEFAULT_FILE,
  randomOpenClose,
} = require('./utils')
const generate = require('./output/generate')

const {
  connections: connectionsCount = DEFAULT_CONNECTIONS,
  duration: durationSeconds = DEFAULT_DURATION,
  file,
} = argv
const filePath = file === '' ? DEFAULT_FILE : null

const bufferSegments = generate(connectionsCount, durationSeconds)

// TODO: write to file works, but process.stdout > file writes broken binary
const writer = filePath ? createWriteStream(filePath) : process.stdout
writer.write(Buffer.concat(bufferSegments))
