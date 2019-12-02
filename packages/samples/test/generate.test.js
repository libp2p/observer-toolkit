'use strict'

const { test } = require('tap')

const generate = require('../mock/generate')
const {
  parseBuffer,
  getAllConnections,
  getConnections,
  getEnumByName,
  getLatestTimepoint,
  getTraffic,
  statusNames,
} = require('@libp2p-observer/data')

const initialConnCount = 6
const durationSeconds = 60

const bin = generate(initialConnCount, durationSeconds)
const { states } = parseBuffer(bin)

const timepointsExceptLatest = states.slice(0, -1)

const initialConnectionsList = getConnections(states[0])
const lastConnectionsList = getConnections(getLatestTimepoint(states))

test('Expected connections exist', t => {
  const lastConnCount = lastConnectionsList.length
  t.equals(states.length, durationSeconds)
  t.equals(initialConnectionsList.length, initialConnCount)
  t.ok(
    lastConnCount >= initialConnCount,
    `lastConnCount ${lastConnCount} >= initialConnCount ${initialConnCount}`
  )
  t.end()
})

test('Open connections increase traffic', t => {
  const activeStatus = getEnumByName('ACTIVE', statusNames)
  const openConnections = getAllConnections(timepointsExceptLatest, {
    filter: connection => connection.getStatus() === activeStatus,
  })

  t.ok(openConnections.length >= initialConnCount)

  for (const connectionAtStart of openConnections) {
    const connectionId = connectionAtStart.getId().toString()

    const startBytesIn = getTraffic(connectionAtStart, 'in', 'bytes')
    const startBytesOut = getTraffic(connectionAtStart, 'out', 'bytes')
    const startPacketsIn = getTraffic(connectionAtStart, 'in', 'packets')
    const startPacketsOut = getTraffic(connectionAtStart, 'out', 'packets')

    const connectionAtEnd = lastConnectionsList.find(
      connection => connection.getId().toString() === connectionId
    )

    const endBytesIn = getTraffic(connectionAtEnd, 'in', 'bytes')
    const endBytesOut = getTraffic(connectionAtEnd, 'out', 'bytes')
    const endPacketsIn = getTraffic(connectionAtEnd, 'in', 'packets')
    const endPacketsOut = getTraffic(connectionAtEnd, 'out', 'packets')

    t.ok(endBytesIn > startBytesIn, `${endBytesIn} > ${startBytesIn}`)
    t.ok(endBytesOut > startBytesOut, `${endBytesOut} > ${startBytesOut}`)
    t.ok(endPacketsIn > startPacketsIn, `${endPacketsIn} > ${startPacketsIn}`)
    t.ok(
      endPacketsOut > startPacketsOut,
      `${endPacketsOut} > ${startPacketsOut}`
    )
  }
  t.end()
})

test('Closed connections have static traffic', t => {
  const closedStatus = getEnumByName('CLOSED', statusNames)
  const closedConnections = getAllConnections(timepointsExceptLatest, {
    filter: connection => connection.getStatus() === closedStatus,
  })

  for (const connectionAtStart of closedConnections) {
    const connectionId = connectionAtStart.getId().toString()

    const startBytesIn = getTraffic(connectionAtStart, 'in', 'bytes')
    const startBytesOut = getTraffic(connectionAtStart, 'out', 'bytes')
    const startPacketsIn = getTraffic(connectionAtStart, 'in', 'packets')
    const startPacketsOut = getTraffic(connectionAtStart, 'out', 'packets')

    const connectionAtEnd = lastConnectionsList.find(
      connection => connection.getId().toString() === connectionId
    )

    const endBytesIn = getTraffic(connectionAtEnd, 'in', 'bytes')
    const endBytesOut = getTraffic(connectionAtEnd, 'out', 'bytes')
    const endPacketsIn = getTraffic(connectionAtEnd, 'in', 'packets')
    const endPacketsOut = getTraffic(connectionAtEnd, 'out', 'packets')

    t.equals(endBytesIn, startBytesIn, `${endBytesIn} > ${startBytesIn}`)
    t.equals(endBytesOut, startBytesOut, `${endBytesOut} > ${startBytesOut}`)
    t.equals(
      endPacketsIn,
      startPacketsIn,
      `${endPacketsIn} > ${startPacketsIn}`
    )
    t.equals(
      endPacketsOut,
      startPacketsOut,
      `${endPacketsOut} > ${startPacketsOut}`
    )
  }
  t.end()
})
