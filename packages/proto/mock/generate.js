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
  while (bufferSegments.length < durationSeconds) {
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
    const bufferSegment = createBufferSegment(state)
    bufferSegments.push(bufferSegment)
  }

  return Buffer.concat(bufferSegments)
}

module.exports = generate
