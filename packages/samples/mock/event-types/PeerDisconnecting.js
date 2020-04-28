'use strict'

const {
  proto: { EventType },
} = require('@libp2p-observer/proto')
const { EventProperty } = EventType

const PeerDisconnecting = new EventType(['PeerDisconnecting'])

PeerDisconnecting.addPropertyTypes(
  new EventProperty(['peerId', EventProperty.PropertyType['PEERID']])
)
PeerDisconnecting.addPropertyTypes(
  new EventProperty(['timeOpen', EventProperty.PropertyType['TIME']])
)
PeerDisconnecting.addPropertyTypes(
  new EventProperty(['age', EventProperty.PropertyType['NUMBER']])
)
PeerDisconnecting.addPropertyTypes(
  new EventProperty(['transport', EventProperty.PropertyType['STRING']])
)

module.exports = PeerDisconnecting
