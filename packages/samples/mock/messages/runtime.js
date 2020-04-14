'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

const {
  DEFAULT_CUTOFFTIME_SECONDS,
  DEFAULT_SNAPSHOT_DURATION,
  HOST_PEER_ID,
  SECOND_IN_MS,
} = require('../utils')

const PeerConnecting = require('../event-types/PeerConnecting')
const PeerDisconnecting = require('../event-types/PeerDisconnecting')
const InboundDHTQuery = require('../event-types/InboundDHTQuery')
const OutboundDHTQuery = require('../event-types/OutboundDHTQuery')

function createRuntime({
  peerId = HOST_PEER_ID,
  stateIntervalDuration = DEFAULT_SNAPSHOT_DURATION,
  cutoffSeconds = DEFAULT_CUTOFFTIME_SECONDS,
} = {}) {
  const runtime = new Runtime([
    'go-libp2p', // Implementation
    '2', // Version
    'macOS', // Platform
    peerId, // Introspecting user's own peer ID
  ])

  runtime.addEventTypes(PeerConnecting)
  runtime.addEventTypes(PeerDisconnecting)
  runtime.addEventTypes(InboundDHTQuery)
  runtime.addEventTypes(OutboundDHTQuery)
  runtime.setSendStateIntervalMs(stateIntervalDuration)
  runtime.setKeepStaleDataMs(cutoffSeconds * SECOND_IN_MS)
  return runtime
}

module.exports = {
  createRuntime,
}
