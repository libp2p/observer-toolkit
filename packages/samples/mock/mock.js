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
  DEFAULT_STREAMS,
  DEFAULT_CONNECTIONS,
  DEFAULT_DURATION,
  DEFAULT_FILE,
} = require('./utils')
const {
  generateComplete,
  generateConnections,
  generateRuntime,
  generateStates,
  generateVersion,
} = require('./generate')

const {
  streams: streamsCount = DEFAULT_STREAMS,
  connections: connectionsCount = DEFAULT_CONNECTIONS,
  duration: durationSeconds = DEFAULT_DURATION,
  file,
  socksrv,
} = argv
const filePath = file === '' ? DEFAULT_FILE : null

if (filePath) {
  console.log(`
    Writing to ${filePath}.
    ${durationSeconds} seconds, ${connectionsCount} initial connections of ~${streamsCount} streams.
  `)
}

if (socksrv) {
  const WebSocket = require('ws')
  const wss = new WebSocket.Server({ port: 8080 })
  wss.on('connection', ws => {
    // prep and keep peer connections, version, runtime
    let firstState = true
    let utcTo = Date.now()
    let utcFrom = utcTo - durationSeconds * 1000
    const connections = generateConnections(connectionsCount, utcFrom)
    const version = generateVersion()
    const runtime = generateRuntime()
    // ready signal handler
    ws.on('message', msg => {
      // send states
      const _utcFrom = utcTo - 1000
      const _utcTo = Date.now()
      const states = generateStates(
        connections,
        connectionsCount,
        utcFrom,
        utcTo
      )
      const data = states.length
        ? Buffer.concat([version, runtime, ...states]).toString('binary')
        : ''
      if (data) {
        utcFrom = _utcFrom
        utcTo = _utcTo
      }
      ws.send(data)
    })
    // on connection, send initial packet
    const states = generateStates(connections, connectionsCount, utcFrom, utcTo)
    ws.send(Buffer.concat([version, runtime, ...states]).toString('binary'))
  })
} else {
  const bufferSegments = generateComplete(connectionsCount, durationSeconds)
  const writer = filePath ? createWriteStream(filePath) : process.stdout
  writer.write(bufferSegments)
}
