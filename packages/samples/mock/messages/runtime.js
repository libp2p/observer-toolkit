'use strict'

const {
  proto: { Runtime },
} = require('@nearform/observer-proto')

const { HOST_PEER_ID } = require('../utils')

const PeerConnecting = require('../event-types/PeerConnecting')
const PeerDisconnecting = require('../event-types/PeerDisconnecting')
const InboundDHTQuery = require('../event-types/InboundDHTQuery')
const OutboundDHTQuery = require('../event-types/OutboundDHTQuery')

function createRuntime({ peerId = HOST_PEER_ID } = {}) {
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
  return runtime
}

module.exports = {
  createRuntime,
}
