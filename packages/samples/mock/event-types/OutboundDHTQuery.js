'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

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
OutboundDHTQuery.addProperties(
  new Runtime.EventProperty([
    'totalSteps',
    Runtime.EventProperty.PropertyType['NUMBER'],
  ])
)
OutboundDHTQuery.addProperties(
  new Runtime.EventProperty([
    'peerIds',
    Runtime.EventProperty.PropertyType['PEERID'],
    true,
  ])
)

module.exports = OutboundDHTQuery
