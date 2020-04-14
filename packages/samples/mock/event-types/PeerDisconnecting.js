'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

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

module.exports = PeerDisconnecting
