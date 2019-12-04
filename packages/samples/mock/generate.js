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

function generate(connectionsCount, durationSeconds) {
  let now = Date.now() - durationSeconds * 1000
  const connections = []

  while (connections.length < connectionsCount) {
    const connection = createConnection()
    mockConnectionActivity(connection, now)
    connections.push(connection)
  }

  const bufferSegments = []

  // add version number to start of file
  const versionBuf = Buffer.alloc(4)
  versionBuf.writeUInt32LE(1, 0)
  bufferSegments.push(versionBuf)

  const runtime = createRuntime()
  const runtimePacket = createProtocolDataPacket(runtime, true)
  bufferSegments.push(createBufferSegment(runtimePacket))

  const numExpectedStatePackets = durationSeconds + bufferSegments.length
  let isFirstIteration = true

  while (bufferSegments.length < numExpectedStatePackets) {
    now += 1000
    connections.forEach(connection => updateConnection(connection, now))

    // Ensure initial connections === connectionsCount at first iteration
    if (!isFirstIteration && randomOpenClose(connectionsCount)) {
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
    isFirstIteration = false
  }

  return Buffer.concat(bufferSegments)
}

module.exports = generate
