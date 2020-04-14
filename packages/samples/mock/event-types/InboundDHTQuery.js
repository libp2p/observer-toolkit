'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

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

module.exports = InboundDHTQuery
