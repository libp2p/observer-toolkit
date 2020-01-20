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
const generate = require('./generate')

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
    let sec = 1
    const tmr = setInterval(() => {
      const bufferSegments = generate(connectionsCount, 1)
      ws.send('send')
      ws.send(bufferSegments.toString('binary')) // client: var b2 = new Buffer(s, 'binary')

      if (sec >= durationSeconds) {
        clearInterval(tmr)
        ws.send('end...')
      }
      sec++
    }, 1000)
    // ws.on('message', message => {
    //   console.log('received: %s', message)
    // })
    ws.send('start...')
  })
}

const bufferSegments = generate(connectionsCount, durationSeconds)

const writer = filePath ? createWriteStream(filePath) : process.stdout

writer.write(bufferSegments)
