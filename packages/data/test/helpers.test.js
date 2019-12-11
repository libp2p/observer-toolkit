'use strict'

const { test } = require('tap')

const {
  proto: { Connection },
} = require('@libp2p-observer/proto')

const { readFileSync } = require('fs')
const path = require('path')
const samplesPath = require.resolve('@libp2p-observer/samples')
const sampleFilePath = path.resolve(
  path.dirname(samplesPath),
  'samples',
  'sample.mock'
)

const { parseImport } = require('../lib/binary')

const {
  getAllConnections,
  getConnections,
  getAllStreamsAtTime,
  getConnectionTraffic,
  getLatestTimepoint,
  getTime,
  getTimeIndex,
} = require('../index.js')

const { states } = parseImport(readFileSync(sampleFilePath))

if (!states.length)
  throw new Error('Deserialization error prevents testing helpers')

test('Test connection getters', t => {
  const allConnections = getAllConnections(states)
  t.type(allConnections, Array)

  let connTypeMismatches_1 = 0

  // Check getAllConnections against getConnections to ensure it gets every connection exactly once
  const allConnectionIds_1 = new Set(
    allConnections.map(connection => {
      if (connection.constructor !== Connection) connTypeMismatches_1++
      return connection.getId().toString()
    })
  )
  t.equal(connTypeMismatches_1, 0)

  const allConnectionIds_2 = new Set()
  let connTypeMismatches_2 = 0

  for (const timepoint of states) {
    const connections = getConnections(timepoint)
    t.type(connections, Array)
    t.ok(
      connections.length <= allConnections.length,
      'No timepoint contains more connections than total'
    )

    for (const connection of connections) {
      if (connection.constructor !== Connection) connTypeMismatches_2++
      const id = connection.getId()

      allConnectionIds_2.add(id.toString())
    }
  }
  t.equal(connTypeMismatches_2, 0)

  t.strictSame(allConnectionIds_1, allConnectionIds_2)
  t.ok(
    allConnectionIds_1.size === allConnections.length,
    'Check each connection has a unique id'
  )
  t.end()
})

test('Test stream getters', t => {
  for (const timepoint of states) {
    const allStreamsWithConnection = getAllStreamsAtTime(timepoint)
    const streamIds_1 = new Set(
      allStreamsWithConnection.map(({ stream }) => stream.getId().toString())
    )

    const streamIds_2 = new Set()
    let connStreamMismatches = 0
    for (const connection of getConnections(timepoint)) {
      const streams = connection.getStreams().getStreamsList()
      for (const stream of streams) {
        streamIds_2.add(stream.getId().toString())

        const connStreamPair = allStreamsWithConnection.find(
          pair => stream.getId() === pair.stream.getId()
        )
        const pairConnId = connStreamPair.connection.getId().toString()
        if (connection.getId().toString() !== pairConnId) connStreamMismatches++
      }
    }
    t.equal(connStreamMismatches, 0)
    t.strictSame(streamIds_1, streamIds_2)
    t.ok(
      streamIds_1.size === allStreamsWithConnection.length,
      'Check each stream has a unique id'
    )
  }
  t.end()
})

test('Test traffic getters', t => {
  const allConnections = getAllConnections(states)
  for (const connection of allConnections) {
    const bytesIn = getConnectionTraffic(connection, 'in', 'bytes')
    t.type(bytesIn, 'number')
    t.ok(bytesIn >= 0)

    const bytesOut = getConnectionTraffic(connection, 'out', 'bytes')
    t.type(bytesOut, 'number')
    t.ok(bytesOut >= 0)

    const packetsIn = getConnectionTraffic(connection, 'in', 'packets')
    t.type(packetsIn, 'number')
    t.ok(packetsIn >= 0)

    const packetsOut = getConnectionTraffic(connection, 'out', 'packets')
    t.type(packetsOut, 'number')
    t.ok(packetsOut >= 0)
  }
  t.end()
})

test('Test timepoint getters', t => {
  let index = 0
  let lastTimestamp = 0
  for (const timepoint of states) {
    t.equal(getTimeIndex(states, getTime(timepoint)), index)
    const timestamp = getTime(timepoint)
    t.ok(timestamp > lastTimestamp)
    t.type(timestamp, 'number')

    lastTimestamp = timestamp
    index++
  }
  t.strictSame(states[index - 1], getLatestTimepoint(states))
  t.end()
})
