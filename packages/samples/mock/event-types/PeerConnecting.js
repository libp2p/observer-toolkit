'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

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

module.exports = PeerConnecting
