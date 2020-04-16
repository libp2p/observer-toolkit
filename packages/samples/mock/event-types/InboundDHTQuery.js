'use strict'

const {
  proto: { EventType },
} = require('@libp2p-observer/proto')
const { EventProperty } = EventType

const InboundDHTQuery = new EventType(['InboundDHTQuery'])

InboundDHTQuery.addPropertyTypes(
  new EventProperty(['result', EventProperty.PropertyType['STRING']])
)
InboundDHTQuery.addPropertyTypes(
  new EventProperty(['totalTimeMs', EventProperty.PropertyType['NUMBER']])
)
InboundDHTQuery.addPropertyTypes(
  new EventProperty(['totalSteps', EventProperty.PropertyType['NUMBER']])
)

module.exports = InboundDHTQuery
