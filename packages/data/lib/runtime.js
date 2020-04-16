'use strict'

const {
  getEventPropertyLookup,
  getEventTypeWithProperties,
} = require('./events')

function getRuntimeEventTypes(runtime) {
  if (!runtime) return []
  let propertyTypeLookup
  const eventTypes = runtime.getEventTypesList().map(eventType => {
    if (!propertyTypeLookup)
      propertyTypeLookup = getEventPropertyLookup(eventType)
    return {
      name: eventType.getName(),
      properties: getEventTypeWithProperties({ eventType, propertyTypeLookup }),
    }
  })
  return eventTypes
}

function getRuntimeEventProperties({
  runtime,
  eventTypes = getRuntimeEventTypes(runtime),
}) {
  const allProperties = []
  eventTypes.forEach(({ name: eventName, properties }) => {
    properties.forEach(({ name: propName, type, hasMultiple }) => {
      const match = allProperties.find(
        prop =>
          prop.name === propName &&
          prop.type === type &&
          prop.hasMultiple === hasMultiple
      )

      if (match) {
        match.eventTypes.push(eventName)
      } else {
        allProperties.push({
          name: propName,
          eventTypes: [eventName],
          type,
          hasMultiple,
        })
      }
    })
  })
  return allProperties
}

module.exports = {
  getRuntimeEventTypes,
  getRuntimeEventProperties,
}
