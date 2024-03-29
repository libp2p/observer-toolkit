'use strict'

const {
  proto: { EventType },
} = require('@libp2p/observer-proto')
const { EventProperty } = EventType

const PeerConnecting = new EventType(['PeerConnecting'])

PeerConnecting.addPropertyTypes(
  new EventProperty(['peerId', EventProperty.PropertyType['PEERID']])
)
PeerConnecting.addPropertyTypes(
  new EventProperty(['transport', EventProperty.PropertyType['STRING']])
)

module.exports = PeerConnecting
