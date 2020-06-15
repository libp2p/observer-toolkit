'use strict'

const {
  proto: { Runtime },
} = require('@libp2p/observer-proto')

const { HOST_PEER_ID } = require('../utils')

const PeerConnecting = require('../event-types/PeerConnecting')
const PeerDisconnecting = require('../event-types/PeerDisconnecting')
const InboundDHTQuery = require('../event-types/InboundDHTQuery')
const OutboundDHTQuery = require('../event-types/OutboundDHTQuery')

function addEventType(eventType, excludeEventTypes, runtime) {
  const eventTypeName = eventType.getName()
  if (excludeEventTypes.includes(eventType.getName())) {
    console.log(`Excluding ${eventTypeName} from initial runtime`)
  } else {
    runtime.addEventTypes(eventType)
  }
}

function createRuntime({ peerId = HOST_PEER_ID } = {}, excludeEventTypes = []) {
  const runtime = new Runtime([
    'go-libp2p', // Implementation
    '2', // Version
    'macOS', // Platform
    peerId, // Introspecting user's own peer ID
  ])

  addEventType(PeerConnecting, excludeEventTypes, runtime)
  addEventType(PeerDisconnecting, excludeEventTypes, runtime)
  addEventType(InboundDHTQuery, excludeEventTypes, runtime)
  addEventType(OutboundDHTQuery, excludeEventTypes, runtime)

  return runtime
}

module.exports = {
  createRuntime,
}
