'use strict'

function getEventTypes(runtime) {
  if (!runtime) return []
  const propertyTypeLookup = getPropertyTypeLookup(runtime)
  const eventTypes = runtime.getEventTypesList().map(eventType => ({
    name: eventType.getName(),
    properties: getEventTypeWithProperties({ eventType, propertyTypeLookup }),
  }))
  return eventTypes
}

function getAllEventProperties({
  runtime,
  eventTypes = getEventTypes(runtime),
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

function getPropertyTypeLookup(runtime) {
  const propertyTypesEnum = runtime.constructor.EventProperty.PropertyType
  const numToStr = Object.entries(propertyTypesEnum).reduce(
    (numToStr, [str, num]) => {
      numToStr[num] = str
      return numToStr
    },
    {}
  )
  return numToStr
}

function getEventTypeWithProperties({
  eventType,
  runtime,
  propertyTypeLookup = getPropertyTypeLookup(runtime),
}) {
  console.log(eventType.getPropertiesList())
  window.proplist = eventType.getPropertiesList()

  return eventType.getPropertiesList().map(prop => ({
    name: prop.getName(),
    type: propertyTypeLookup[prop.getType()],
    hasMultiple: prop.getHasMultiple(),
  }))
}

module.exports = {
  getEventTypes,
  getAllEventProperties,
  getPropertyTypeLookup,
  getEventTypeWithProperties,
}
