'use strict'

const { random, randomOpenClose } = require('./utils')

const { createBufferSegment } = require('../utils/binary')
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

function generate(connectionsCount, durationSeconds) {
  let now = Date.now() - durationSeconds * 1000
  const connections = []

  while (connections.length < connectionsCount) {
    const connection = createConnection()
    mockConnectionActivity(connection, now)
    connections.push(connection)
  }

  const bufferSegments = []

  // add file version number to start of buffer segments
  bufferSegments.push(Buffer.alloc(4).writeUInt32LE(1, 0))

  const runtime = createRuntime()
  const statePacket = createProtocolDataPacket(runtime, true)
  bufferSegments.push(createBufferSegment(runtimePacket))

  const numExpectedStatePackets = durationSeconds + 2

  while (bufferSegments.length < numExpectedStatePackets) {
    now += 1000
    connections.forEach(connection => updateConnection(connection, now))

    // Chance of new connection, _after_ first iteration so initial connections === connectionsCount
    if (bufferSegments.length && randomOpenClose(connectionsCount)) {
      // Open a new connection
      const connection = createConnection({
        status: statusList.getNum('OPENING'),
      })
      addStreamsToConnection(connection, { now, secondsOpen: random() })

      connections.push(connection)
    }

    const state = createState(connections, now)
    const statePacket = createProtocolDataPacket(state)
    const bufferSegment = createBufferSegment(statePacket)
    bufferSegments.push(bufferSegment)
  }

  return Buffer.concat(bufferSegments)
}

module.exports = generate
