const { test } = require('tap')

const generate = require('../mock/generate')
const { parseBuffer } = require('../utils/binary')
const { status } = require('../utils/enums')
const {
  getAllConnections,
  getConnections,
  getEnumByName,
  getLatestTimepoint,
  getTraffic,
} = require('../utils/helpers')

const initialConnectionsCount = 6
const durationSeconds = 60

const bin = generate(initialConnectionsCount, durationSeconds)
const timepoints = parseBuffer(bin)

const timepointsExceptLatest = timepoints.slice(0, -1)

const initialConnectionsList = getConnections(timepoints[0])
const lastConnectionsList = getConnections(getLatestTimepoint(timepoints))

test('Expected connections exist', (t) => {
  t.equals(timepoints.length, durationSeconds)
  t.equals(initialConnectionsList.length, initialConnectionsCount)
  t.ok(lastConnectionsList.length > initialConnectionsCount)
  t.end()
})

test('Open connections increase traffic', (t) => {
  const activeStatus = getEnumByName('ACTIVE', status)
  const openConnections = getAllConnections(timepointsExceptLatest, { filter: connection => connection.getStatus() === activeStatus })

  console.log('openConnections.length', openConnections.length)
  t.ok(openConnections.length >= initialConnectionsCount)

  for (const connectionAtStart of openConnections) {
    const connectionId = connectionAtStart.getId().toString()

    const startBytesIn = getTraffic(connectionAtStart, 'in', 'bytes')
    const startBytesOut = getTraffic(connectionAtStart, 'out', 'bytes')
    const startPacketsIn = getTraffic(connectionAtStart, 'in', 'packets')
    const startPacketsOut = getTraffic(connectionAtStart, 'out', 'packets')

    const connectionAtEnd = lastConnectionsList.find(connection => connection.getId().toString() === connectionId)

    const endBytesIn = getTraffic(connectionAtEnd, 'in', 'bytes')
    const endBytesOut = getTraffic(connectionAtEnd, 'out', 'bytes')
    const endPacketsIn = getTraffic(connectionAtEnd, 'in', 'packets')
    const endPacketsOut = getTraffic(connectionAtEnd, 'out', 'packets')

    t.ok(endBytesIn > startBytesIn)
    t.ok(endBytesOut > startBytesOut)
    t.ok(endPacketsIn > startPacketsIn, `${endPacketsIn} > ${startPacketsIn}`)
    t.ok(endPacketsOut > startPacketsOut, `${endPacketsOut} > ${startPacketsOut}`)
  }
  t.end()
})

test('Closed connections have static traffic', (t) => {
  const closedStatus = getEnumByName('CLOSED', status)
  const closedConnections = getAllConnections(timepointsExceptLatest, { filter: connection => connection.getStatus() === closedStatus })

  console.log('closedConnections.length', closedConnections.length)

  for (const connectionAtStart of closedConnections) {
    const connectionId = connectionAtStart.getId().toString()

    const startBytesIn = getTraffic(connectionAtStart, 'in', 'bytes')
    const startBytesOut = getTraffic(connectionAtStart, 'out', 'bytes')
    const startPacketsIn = getTraffic(connectionAtStart, 'in', 'packets')
    const startPacketsOut = getTraffic(connectionAtStart, 'out', 'packets')

    const connectionAtEnd = lastConnectionsList.find(connection => connection.getId().toString() === connectionId)

    const endBytesIn = getTraffic(connectionAtEnd, 'in', 'bytes')
    const endBytesOut = getTraffic(connectionAtEnd, 'out', 'bytes')
    const endPacketsIn = getTraffic(connectionAtEnd, 'in', 'packets')
    const endPacketsOut = getTraffic(connectionAtEnd, 'out', 'packets')

    t.equals(endBytesIn, startBytesIn)
    t.equals(endBytesOut, startBytesOut)
    t.equals(endPacketsIn, startPacketsIn)
    t.equals(endPacketsOut, startPacketsOut)
  }
  t.end()
})
