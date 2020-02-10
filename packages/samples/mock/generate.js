'use strict'

const { random, randomOpenClose } = require('./utils')

const { createBufferSegment } = require('../output/binary')
const {
  createConnection,
  mockConnectionActivity,
  updateConnection,
  addStreamsToConnection,
} = require('./messages/connections')
const { createDHT, updateDHT } = require('./messages/dht')
const { createState } = require('./messages/states')
const { createRuntime } = require('./messages/runtime')
const { createProtocolDataPacket } = require('./messages/protocol-data-packet')
const { statusList } = require('./enums/statusList')

function generateConnections(total, now) {
  return Array.apply(null, Array(total)).map(function() {
    const connection = createConnection({
      status: statusList.getNum('ACTIVE'),
    })
    mockConnectionActivity(connection, now)
    return connection
  })
}

function generateDHT() {
  return createDHT()
}

function generateRuntime() {
  const runtime = createRuntime()
  const runtimePacket = createProtocolDataPacket(runtime, true)
  return createBufferSegment(runtimePacket)
}

function updateConnections(connections, total, now) {
  connections.forEach(connection => updateConnection(connection, now))
  // ensure initial connections === connectionsCount at first iteration
  if (total !== null && randomOpenClose(total)) {
    // open a new connection
    const connection = createConnection({
      status: statusList.getNum('OPENING'),
    })
    addStreamsToConnection(connection, { now, secondsOpen: random() })
    connections.push(connection)
  }
}

function generateState(connections, now, dht) {
  const state = createState(connections, now)
  const statePacket = createProtocolDataPacket(state)
  return createBufferSegment(statePacket)
}

function generateStates(connections, connectionsCount, utcFrom, utcTo, dht) {
  const stateBuffers = []
  const states = Math.floor((utcTo - utcFrom) / 1000)
  for (let state = 1; state <= states; state++) {
    const now = utcFrom + state * 1000
    const connCount = state !== 1 ? connectionsCount : null
    updateConnections(connections, connCount, now)
    updateDHT(dht)
    stateBuffers.push(generateState(connections, now, dht))
  }
  return stateBuffers
}

function generateVersion() {
  const versionBuf = Buffer.alloc(4)
  versionBuf.writeUInt32LE(1, 0)
  return versionBuf
}

function generateComplete(connectionsCount, durationSeconds) {
  const utcTo = Date.now()
  const utcFrom = utcTo - durationSeconds * 1000

  const version = generateVersion()
  const runtime = generateRuntime()
  const connections = generateConnections(connectionsCount, utcFrom)
  const dht = generateDHT()
  const states = generateStates(
    connections,
    connectionsCount,
    utcFrom,
    utcTo,
    dht
  )
  return Buffer.concat([version, runtime, ...states])
}

module.exports = {
  generateComplete,
  generateConnections,
  generateDHT,
  generateRuntime,
  generateState,
  generateStates,
  generateVersion,
}
