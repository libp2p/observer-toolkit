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
  n: {
    alias: 'snapshot',
    describe: 'snapshot duration in milliseconds ',
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
  t: {
    alias: 'cutoff',
    describe: 'number of seconds after which old data can be discarded',
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
  DEFAULT_SNAPSHOT_DURATION,
  DEFAULT_CUTOFFTIME_SECONDS,
} = require('./utils')
const { generateComplete } = require('./generate')

const { start: startServer } = require('./sock')

const {
  streams: streamsCount = DEFAULT_STREAMS,
  connections: connectionsCount = DEFAULT_CONNECTIONS,
  duration: durationSeconds = DEFAULT_DURATION,
  peers: peersCount = DEFAULT_PEERS,
  snapshot: durationSnapshot = DEFAULT_SNAPSHOT_DURATION,
  cutoff: cutoffSeconds = DEFAULT_CUTOFFTIME_SECONDS,
  file,
  socksrv,
} = argv
const filePath = file === '' ? DEFAULT_FILE : null

if (filePath) {
  console.log(`

    Writing to ${filePath} with:

    - ${durationSeconds} seconds sample duration ('-d ${durationSeconds}')
    - State messages every ${durationSnapshot} milliseconds ('-n ${durationSnapshot}')
    - ${connectionsCount} initial connections ('-c ${connectionsCount}')
    - Around ~${streamsCount} streams per connection ('-s ${streamsCount}')
    - At least ${peersCount} initial peers in the DHT ('-p ${peersCount}')
    - Keeping old data for ${cutoffSeconds} seconds ('-t ${cutoffSeconds}')

  `)
}

if (socksrv) {
  startServer({
    connectionsCount,
    peersCount,
    duration: durationSnapshot,
    cutoffSeconds,
  })
} else {
  const bufferSegments = generateComplete(
    connectionsCount,
    durationSeconds,
    peersCount,
    durationSnapshot,
    cutoffSeconds
  )
  const writer = filePath ? createWriteStream(filePath) : process.stdout
  writer.write(bufferSegments)
}
