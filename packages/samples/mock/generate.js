'use strict'

const {
  SECOND_IN_MS,
  random,
  randomOpenClose,
  generateHashId,
} = require('./utils')

const {
  proto: { Configuration },
} = require('@nearform/observer-proto')
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
const { createCommandResponse } = require('./messages/command-response')
const {
  createResponseServerMessage,
  createRuntimeServerMessage,
  createStateServerMessage,
} = require('./messages/server-message')
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

function generatePeerId() {
  return generateHashId()
}

function generateRuntime(options = {}, runtime = createRuntime(options)) {
  const runtimePacket = createRuntimeServerMessage(runtime)
  return createBufferSegment(runtimePacket)
}

function generateCommandResponse(
  options = {},
  response = createCommandResponse(options)
) {
  const responsePacket = createResponseServerMessage(response)
  return createBufferSegment(responsePacket)
}

function updateConnections(connections, total, now, duration, cutoffSeconds) {
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
    if (closedSecs >= cutoffSeconds) {
      connections.splice(idx, 1)
    }
  })
}

function generateConnectionEvents({
  connections,
  msgQueue = [],
  utcNow,
  version,
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
      const data = Buffer.concat([version, event]).toString('binary')
      msgQueue.push({ ts: now, type: 'event', data, event })
    })

  return msgQueue
}

function generateEventsFlood({ msgQueue = [], utcNow, version }) {
  // generate a flood of events
  const step = 50 // .. every 50ms
  for (let i = 0; i < 1000; i += step) {
    const now = utcNow + i
    const event = generateEvent({ now, type: 'flood' })
    const data = Buffer.concat([version, event]).toString('binary')
    msgQueue.push({ ts: now, type: 'event', data, event })
  }

  return msgQueue
}

function generateState(connections, now, dht, duration) {
  const state = createState(connections, now, dht, duration)
  const statePacket = createStateServerMessage(state)
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
  cutoffSeconds,
}) {
  // Generates states and events for file and stdout output
  let msgBuffers = []
  const states = Math.floor((utcTo - utcFrom) / duration)

  for (let state = 1; state <= states; state++) {
    const intervalEnd = utcFrom + state * duration
    const intervalStart = intervalEnd - duration

    updateConnections(
      connections,
      connectionsCount,
      intervalEnd,
      duration,
      cutoffSeconds
    )

    const events = generateConnectionEvents({
      connections,
      msgBuffers,
      utcNow: intervalStart,
      version,
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

    const statePacket = generateState(connections, intervalEnd, dht, duration)
    msgBuffers.push(statePacket)
  }

  return msgBuffers
}

function generateVersion() {
  const versionBuf = Buffer.alloc(4)
  versionBuf.writeUInt32LE(1, 0)
  return versionBuf
}

function generateComplete(
  connectionsCount,
  durationSeconds,
  peersCount,
  durationSnapshot,
  cutoffSeconds
) {
  const utcTo = Date.now()
  const utcFrom = utcTo - durationSeconds * SECOND_IN_MS

  const version = generateVersion()
  const runtime = generateRuntime()
  const connections = generateConnections(connectionsCount, utcFrom)
  const peerIds = connections.map(c => c.getPeerId())

  const effectiveConfig = new Configuration()
  effectiveConfig.setStateSnapshotIntervalMs(durationSnapshot)
  effectiveConfig.setRetentionPeriodMs(cutoffSeconds * 1000)
  const helloResponse = generateCommandResponse({
    id: 0,
    effectiveConfig,
  })

  const startTs = utcFrom - Math.floor(random() * durationSnapshot)
  const dht = generateDHT({
    startTs,
    peerIds,
    peersCount,
    connections,
    duration: durationSnapshot,
  })

  const activityMsgs = generateActivity({
    connections,
    connectionsCount,
    utcFrom,
    utcTo,
    dht,
    version,
    duration: durationSnapshot,
    cutoffSeconds,
  })

  return Buffer.concat([version, runtime, helloResponse, ...activityMsgs])
}

module.exports = {
  generateCommandResponse,
  generateComplete,
  generateConnections,
  generateConnectionEvents,
  generateEventsFlood,
  generateDHT,
  generateEvent,
  generatePeerId,
  generateRuntime,
  generateState,
  generateActivity,
  generateVersion,
  updateConnections,
  updateDHT,
}
