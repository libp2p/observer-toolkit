'use strict'

function getEventType(event) {
  return event.getType().getName()
}

function getEventPropertyLookup(eventType) {
  const propertyTypesEnum = eventType.constructor.EventProperty.PropertyType
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
  propertyTypeLookup = getEventPropertyLookup(eventType),
}) {
  return eventType.getPropertyTypesList().map(prop => ({
    name: prop.getName(),
    type: propertyTypeLookup[prop.getType()],
    hasMultiple: prop.getHasMultiple(),
  }))
}

module.exports = {
  getEventType,
  getEventPropertyLookup,
  getEventTypeWithProperties,
}
