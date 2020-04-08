'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

const { HOST_PEER_ID } = require('../utils')

const PeerConnecting = new Runtime.EventType(['PeerConnecting'])
PeerConnecting.addProperties(
  new Runtime.EventProperty([
    'peerId',
    Runtime.EventProperty.PropertyType['PEERID'],
  ])
)
PeerConnecting.addProperties(
  new Runtime.EventProperty([
    'transport',
    Runtime.EventProperty.PropertyType['STRING'],
  ])
)

const PeerDisconnecting = new Runtime.EventType(['PeerDisconnecting'])
PeerDisconnecting.addProperties(
  new Runtime.EventProperty([
    'peerId',
    Runtime.EventProperty.PropertyType['PEERID'],
  ])
)
PeerDisconnecting.addProperties(
  new Runtime.EventProperty([
    'timeOpen',
    Runtime.EventProperty.PropertyType['TIME'],
  ])
)
PeerDisconnecting.addProperties(
  new Runtime.EventProperty([
    'age',
    Runtime.EventProperty.PropertyType['NUMBER'],
  ])
)
PeerDisconnecting.addProperties(
  new Runtime.EventProperty([
    'transport',
    Runtime.EventProperty.PropertyType['STRING'],
  ])
)

const InboundDHTQuery = new Runtime.EventType(['InboundDHTQuery'])
InboundDHTQuery.addProperties(
  new Runtime.EventProperty([
    'result',
    Runtime.EventProperty.PropertyType['STRING'],
  ])
)
InboundDHTQuery.addProperties(
  new Runtime.EventProperty([
    'totalTimeMs',
    Runtime.EventProperty.PropertyType['NUMBER'],
  ])
)
InboundDHTQuery.addProperties(
  new Runtime.EventProperty([
    'totalSteps',
    Runtime.EventProperty.PropertyType['NUMBER'],
  ])
)

const OutboundDHTQuery = new Runtime.EventType(['OutboundDHTQuery'])
OutboundDHTQuery.addProperties(
  new Runtime.EventProperty([
    'result',
    Runtime.EventProperty.PropertyType['STRING'],
  ])
)
OutboundDHTQuery.addProperties(
  new Runtime.EventProperty([
    'totalTimeMs',
    Runtime.EventProperty.PropertyType['NUMBER'],
  ])
)
OutboundDHTQuery.addProperties(
  new Runtime.EventProperty([
    'totalSteps',
    Runtime.EventProperty.PropertyType['NUMBER'],
  ])
)

function createRuntime() {
  const runtime = new Runtime([
    'go-libp2p', // Implementation
    '2', // Version
    'macOS', // Platform
    HOST_PEER_ID, // Introspecting user's own peer ID
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
