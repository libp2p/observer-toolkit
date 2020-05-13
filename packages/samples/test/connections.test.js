'use strict'

const { test } = require('tap')

const {
  getAllConnections,
  getConnections,
  getEnumByName,
  getLatestTimepoint,
  getConnectionTraffic,
  statusNames,
} = require('@nearform/observer-data')

const { SECOND_IN_MS } = require('../mock/utils')
const {
  states,
  initialConnCount,
  durationSeconds,
  durationSnapshot,
} = require('./fixtures/generate')

const timepointsExceptLatest = states.slice(0, -1)

const initialConnectionsList = getConnections(states[0])
const lastConnectionsList = getConnections(getLatestTimepoint(states))
const statesPerSecond = durationSnapshot / SECOND_IN_MS

test('Expected connections exist', t => {
  const lastConnCount = lastConnectionsList.length
  t.equals(states.length, durationSeconds * statesPerSecond)
  t.equals(initialConnectionsList.length, initialConnCount)
  t.ok(
    lastConnCount >= initialConnCount,
    `lastConnCount ${lastConnCount} >= initialConnCount ${initialConnCount}`
  )
  t.end()
})

test('Connections have unique IDs', t => {
  const uniquePeerIds = new Set()
  const peerIds = lastConnectionsList.map(conn => conn.getPeerId())
  const duplicatePeerIds = peerIds.filter(peerId => {
    if (uniquePeerIds.has(peerId)) return true
    uniquePeerIds.add(peerId)
    return false
  })
  t.strictSame(duplicatePeerIds, [], 'Expect no duplicate peer ids')

  const uniqueConnIds = new Set()
  const connIds = lastConnectionsList.map(conn => conn.getId().toString())
  const duplicateConnIds = connIds.filter(connId => {
    if (uniqueConnIds.has(connId)) return true
    uniqueConnIds.add(connId)
    return false
  })
  t.strictSame(duplicateConnIds, [], 'Expect no duplicate connection ids')

  t.end()
})

test('Open connections increase traffic', t => {
  const activeStatus = getEnumByName('ACTIVE', statusNames)
  const everOpenConnections = getAllConnections(timepointsExceptLatest, {
    filter: connection => connection.getStatus() === activeStatus,
  })

  t.ok(everOpenConnections.length >= initialConnCount)

  for (const connectionAtStart of everOpenConnections) {
    const connectionId = connectionAtStart.getId().toString()

    const startBytesIn = getConnectionTraffic(connectionAtStart, 'in', 'bytes')
    const startBytesOut = getConnectionTraffic(
      connectionAtStart,
      'out',
      'bytes'
    )
    const startPacketsIn = getConnectionTraffic(
      connectionAtStart,
      'in',
      'packets'
    )
    const startPacketsOut = getConnectionTraffic(
      connectionAtStart,
      'out',
      'packets'
    )

    const connectionAtEnd = lastConnectionsList.find(
      connection => connection.getId().toString() === connectionId
    )

    const endBytesIn = getConnectionTraffic(connectionAtEnd, 'in', 'bytes')
    const endBytesOut = getConnectionTraffic(connectionAtEnd, 'out', 'bytes')
    const endPacketsIn = getConnectionTraffic(connectionAtEnd, 'in', 'packets')
    const endPacketsOut = getConnectionTraffic(
      connectionAtEnd,
      'out',
      'packets'
    )

    if (connectionAtEnd.getStatus() === activeStatus) {
      t.ok(
        endBytesIn > startBytesIn,
        `Bytes In: ${endBytesIn} > ${startBytesIn}`
      )
      t.ok(
        endBytesOut > startBytesOut,
        `Bytes Out: ${endBytesOut} > ${startBytesOut}`
      )
      t.ok(
        endPacketsIn > startPacketsIn,
        `Packets In: ${endPacketsIn} > ${startPacketsIn}`
      )
      t.ok(
        endPacketsOut > startPacketsOut,
        `Packets out: ${endPacketsOut} > ${startPacketsOut}`
      )
    } else {
      // Swiftly-closed connections may have added no data, use >= not >
      t.ok(
        endBytesIn >= startBytesIn,
        `Bytes In: ${endBytesIn} >= ${startBytesIn}`
      )
      t.ok(
        endBytesOut >= startBytesOut,
        `Bytes Out: ${endBytesOut} >= ${startBytesOut}`
      )
      t.ok(
        endPacketsIn >= startPacketsIn,
        `Packets In: ${endPacketsIn} >= ${startPacketsIn}`
      )
      t.ok(
        endPacketsOut >= startPacketsOut,
        `Packets out: ${endPacketsOut} >= ${startPacketsOut}`
      )
    }
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

    const startBytesIn = getConnectionTraffic(connectionAtStart, 'in', 'bytes')
    const startBytesOut = getConnectionTraffic(
      connectionAtStart,
      'out',
      'bytes'
    )
    const startPacketsIn = getConnectionTraffic(
      connectionAtStart,
      'in',
      'packets'
    )
    const startPacketsOut = getConnectionTraffic(
      connectionAtStart,
      'out',
      'packets'
    )

    const connectionAtEnd = lastConnectionsList.find(
      connection => connection.getId().toString() === connectionId
    )

    const endBytesIn = getConnectionTraffic(connectionAtEnd, 'in', 'bytes')
    const endBytesOut = getConnectionTraffic(connectionAtEnd, 'out', 'bytes')
    const endPacketsIn = getConnectionTraffic(connectionAtEnd, 'in', 'packets')
    const endPacketsOut = getConnectionTraffic(
      connectionAtEnd,
      'out',
      'packets'
    )

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
