'use strict'

const { random, randomOpenClose } = require('./utils')

const { createBufferSegment } = require('../output/binary')
const {
  createConnection,
  mockConnectionActivity,
  updateConnection,
  addStreamsToConnection,
} = require('./messages/connections')
const { createState } = require('./messages/states')
const { createRuntime } = require('./messages/runtime')
const { createProtocolDataPacket } = require('./messages/protocol-data-packet')
const { statusList } = require('./enums/statusList')

function generateConnections(total, now) {
  return Array.apply(null, Array(total - 1)).map(function() {
    const connection = createConnection()
    mockConnectionActivity(connection, now)
    return connection
  })
}

function generateRuntime() {
  const runtime = createRuntime()
  const runtimePacket = createProtocolDataPacket(runtime, true)
  return createBufferSegment(runtimePacket)
}

function updateConnections(connections, total, now) {
  connections.forEach(connection => updateConnection(connection, now))
  // ensure initial connections === connectionsCount at first iteration
  if (total && randomOpenClose(total)) {
    // open a new connection
    const connection = createConnection({
      status: statusList.getNum('OPENING'),
    })
    addStreamsToConnection(connection, { now, secondsOpen: random() })
    connections.push(connection)
  }
}

function generateState(connections, now) {
  const state = createState(connections, now)
  const statePacket = createProtocolDataPacket(state)
  return createBufferSegment(statePacket)
}

function generateStates(connections, connectionsCount, utcFrom, utcTo) {
  const stateBuffers = []
  const states = Math.floor((utcTo - utcFrom) / 1000)
  for (let state = 1; state <= states; state++) {
    const now = utcFrom + state * 1000
    const connCount = state === 1 ? connectionsCount : 0
    updateConnections(connections, connCount, now)
    stateBuffers.push(generateState(connections, now))
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
  const states = generateStates(connections, connectionsCount, utcFrom, utcTo)
  return Buffer.concat([version, runtime, ...states])
}

module.exports = {
  generateComplete,
  generateConnections,
  generateRuntime,
  generateState,
  generateStates,
  generateVersion,
}
