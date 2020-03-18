'use strict'

const {
  CUTOFFTIME_SECONDS,
  SECOND_IN_MS,
  random,
  randomOpenClose,
} = require('./utils')

const { createBufferSegment } = require('../output/binary')
const {
  createConnection,
  mockConnectionActivity,
  updateConnection,
  addStreamsToConnection,
} = require('./messages/connections')
const { createDHT, updateDHT } = require('./messages/dht')
const {
  getPeerDisconnectingProps,
  getPeerConnectingProps,
  generateEvent,
} = require('./messages/events')
const { createState } = require('./messages/states')
const { createRuntime } = require('./messages/runtime')
const {
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

function generateRuntime(options = {}) {
  const runtime = createRuntime((options = {}))
  const runtimePacket = createProtocolRuntimePacket(runtime)
  return createBufferSegment(runtimePacket)
}

function updateConnections(connections, total, now, duration) {
  connections.forEach(connection => updateConnection(connection, now, duration))
  if (randomOpenClose(total)) {
    // open a new connection
    const connection = createConnection({
      status: statusList.getNum('OPENING'),
    })
    addStreamsToConnection(connection, { now, secondsOpen: random() })
    connections.push(connection)
  }
  // close connections beyond cutoff point
  connections.forEach((cn, idx) => {
    if (statusList.getItem(cn.getStatus()) !== 'CLOSED') {
      return false
    }
    const timeline = cn.getTimeline()
    const closedSecs = (now - timeline.getCloseTs()) / SECOND_IN_MS
    if (closedSecs >= CUTOFFTIME_SECONDS) {
      connections.splice(idx, 1)
    }
  })
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

function generateState(connections, now, dht, duration) {
  const state = createState(connections, now, dht, duration)
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
  duration,
}) {
  // Generates states and events for file and stdout output
  let msgBuffers = []
  const states = Math.floor((utcTo - utcFrom) / duration)

  for (let state = 1; state <= states; state++) {
    const intervalEnd = utcFrom + state * duration
    const intervalStart = intervalEnd - duration

    updateConnections(connections, connectionsCount, intervalEnd, duration)

    const events = generateConnectionEvents({
      connections,
      msgBuffers,
      utcNow: intervalStart,
      version,
      runtime,
      duration,
    })
    const eventBuffers = events.map(({ event }) => event)
    msgBuffers = [...msgBuffers, ...eventBuffers]

    updateDHT({
      dht,
      connections,
      utcFrom: intervalStart,
      utcTo: intervalEnd,
      msgBuffers,
      duration,
    })
    msgBuffers.push(generateState(connections, intervalEnd, dht))
  }
  return msgBuffers
}

function generateVersion() {
  const versionBuf = Buffer.alloc(4)
  versionBuf.writeUInt32LE(1, 0)
  return versionBuf
}

function generateComplete(connectionsCount, durationSeconds, peersCount, durationSnapshot) {
  const utcTo = Date.now()
  const utcFrom = utcTo - durationSeconds * SECOND_IN_MS

  const version = generateVersion()
  const runtime = generateRuntime({ stateIntervalDuration: duration })
  const connections = generateConnections(connectionsCount, utcFrom)
  const peerIds = connections.map(c => c.getPeerId())

  const startTs = utcFrom - Math.floor(random() * SECOND_IN_MS)
  const dht = generateDHT({ startTs, peerIds, peersCount, connections, durationSnapshot })

  const activityMsgs = generateActivity({
    connections,
    connectionsCount,
    utcFrom,
    utcTo,
    dht,
    version,
    runtime,
    durationSnapshot,
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
