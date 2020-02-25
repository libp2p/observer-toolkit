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
  p: {
    alias: 'peers',
    describe: 'number of peers in DHT at start of simulation',
    type: 'number',
  },
})
const { createWriteStream } = require('fs')

const {
  DEFAULT_STREAMS,
  DEFAULT_CONNECTIONS,
  DEFAULT_DURATION,
  DEFAULT_FILE,
  DEFAULT_PEERS,
} = require('./utils')
const { generateComplete } = require('./generate')

const { start: startServer } = require('./sock')

const {
  streams: streamsCount = DEFAULT_STREAMS,
  connections: connectionsCount = DEFAULT_CONNECTIONS,
  duration: durationSeconds = DEFAULT_DURATION,
  peers: peersCount = DEFAULT_PEERS,
  file,
  socksrv,
} = argv
const filePath = file === '' ? DEFAULT_FILE : null

if (filePath) {
  console.log(`

    Writing to ${filePath} with:

    - ${durationSeconds} seconds sample duration ('-d ${durationSeconds}')
    - ${connectionsCount} initial connections ('-c ${connectionsCount}')
    - Around ~${streamsCount} streams per connection ('-s ${streamsCount}')
    - At least ${peersCount} initial peers in the DHT ('-p ${peersCount}')

  `)
}

if (socksrv) {
  startServer({ connectionsCount })
} else {
  const bufferSegments = generateComplete(
    connectionsCount,
    durationSeconds,
    peersCount
  )
  const writer = filePath ? createWriteStream(filePath) : process.stdout
  writer.write(bufferSegments)
}
