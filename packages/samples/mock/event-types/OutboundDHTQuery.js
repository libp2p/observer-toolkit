'use strict'

const {
  proto: { EventType },
} = require('@libp2p-observer/proto')
const { EventProperty } = EventType

const OutboundDHTQuery = new EventType(['OutboundDHTQuery'])

OutboundDHTQuery.addPropertyTypes(
  new EventProperty(['result', EventProperty.PropertyType['STRING']])
)
OutboundDHTQuery.addPropertyTypes(
  new EventProperty(['totalTimeMs', EventProperty.PropertyType['NUMBER']])
)
OutboundDHTQuery.addPropertyTypes(
  new EventProperty(['totalSteps', EventProperty.PropertyType['NUMBER']])
)
OutboundDHTQuery.addPropertyTypes(
  new EventProperty(['peerIds', EventProperty.PropertyType['PEERID'], true])
)

module.exports = OutboundDHTQuery
