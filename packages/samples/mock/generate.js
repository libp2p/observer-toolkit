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
const {
  createEvent,
  getPeerDisconnectingProps,
  getPeerConnectingProps,
} = require('./messages/events')
const { createState } = require('./messages/states')
const { createRuntime } = require('./messages/runtime')
const {
  createProtocolEventPacket,
  createProtocolRuntimePacket,
  createProtocolStatePacket,
} = require('./messages/protocol-data-packet')
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

function generateDHT(opt = {}) {
  return createDHT(opt)
}

function generateRuntime() {
  const runtime = createRuntime()
  const runtimePacket = createProtocolRuntimePacket(runtime)
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

function generateEvent({ now = Date.now(), type = '', content = {} } = {}) {
  const event = createEvent({ now, type, content })
  const eventPacket = createProtocolEventPacket(event)
  return createBufferSegment(eventPacket)
}

function generateConnectionEvents({
  connections,
  msgQueue = [],
  utcNow,
  version,
  runtime,
}) {
  // send event when connection is opening/closing
  connections
    .filter(cn => cn.getStatus() === 2 || cn.getStatus() === 3)
    .forEach(cn => {
      const now = utcNow + Math.floor(random() * 800 + 100)
      const getEventProps =
        cn.getStatus() === 2
          ? getPeerConnectingProps
          : getPeerDisconnectingProps
      const event = generateEvent(getEventProps(now, cn))
      const data = Buffer.concat([version, runtime, event]).toString('binary')
      msgQueue.push({ ts: now, type: 'event', data, event })
    })

  return msgQueue
}

function generateState(connections, now, dht) {
  const state = createState(connections, now, dht)
  const statePacket = createProtocolStatePacket(state)
  return createBufferSegment(statePacket)
}

function generateActivity({
  connections,
  connectionsCount,
  utcFrom,
  utcTo,
  dht,
  version,
  runtime,
}) {
  // Generates states and events for file and stdout output
  let msgBuffers = []
  const states = Math.floor((utcTo - utcFrom) / 1000)

  for (let state = 1; state <= states; state++) {
    const intervalEnd = utcFrom + state * 1000
    const intervalStart = intervalEnd - 1000

    const connCount = state !== 1 ? connectionsCount : null
    updateConnections(connections, connCount, intervalEnd)

    const events = generateConnectionEvents({
      connections,
      msgBuffers,
      utcNow: intervalStart,
      version,
      runtime,
    })
    const eventBuffers = events.map(({ event }) => event)
    msgBuffers = [...msgBuffers, ...eventBuffers]

    updateDHT(dht, connections, intervalStart, intervalEnd)
    msgBuffers.push(generateState(connections, intervalEnd, dht))
  }
  return msgBuffers
}

function generateVersion() {
  const versionBuf = Buffer.alloc(4)
  versionBuf.writeUInt32LE(1, 0)
  return versionBuf
}

function generateComplete(connectionsCount, durationSeconds, peersCount) {
  const utcTo = Date.now()
  const utcFrom = utcTo - durationSeconds * 1000

  const version = generateVersion()
  const runtime = generateRuntime()
  const connections = generateConnections(connectionsCount, utcFrom)
  const peerIds = connections.map(c => c.getPeerId())

  const startTs = utcFrom - Math.floor(random() * 1000)
  const dht = generateDHT({ startTs, peerIds, peersCount, connections })

  const activityMsgs = generateActivity({
    connections,
    connectionsCount,
    utcFrom,
    utcTo,
    dht,
    version,
    runtime,
  })

  return Buffer.concat([version, runtime, ...activityMsgs])
}

module.exports = {
  generateComplete,
  generateConnections,
  generateConnectionEvents,
  generateDHT,
  generateEvent,
  generateRuntime,
  generateState,
  generateActivity,
  generateVersion,
  updateConnections,
  updateDHT,
}
