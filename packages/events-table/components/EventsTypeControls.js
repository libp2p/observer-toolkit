import React, { useContext, useEffect, useRef } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { proto } from '@libp2p/observer-proto'
import { getRuntimeEventTypes } from '@libp2p/observer-data'
import {
  FilterContext,
  Icon,
  RuntimeContext,
  Monospace,
  Tooltip,
  WebsocketContext,
} from '@libp2p/observer-sdk'

import EventTypesPropertyControls from './EventTypesPropertyControls'

function getEventTypeMetadata(eventName, eventTypes) {
  return eventTypes.find(type => type.name === eventName)
}

function getEventPropertyData(
  eventName,
  eventTypes,
  propertyTypes,
  propertiesFromEvents
) {
  const eventType = getEventTypeMetadata(eventName, eventTypes)
  const properties = eventType
    ? eventType.properties
    : propertiesFromEvents[eventName]
  if (!properties) return null

  const eventPropertyData = properties.reduce((propertyData, property) => {
    const propertyStatus = propertyTypes.find(
      propStatus => propStatus.name === property.name
    )

    // Is typically missing on first pass before effect updates hook state
    if (!propertyStatus) return propertyData

    return [...propertyData, propertyStatus]
  }, [])
  return eventPropertyData
}

const EventTypesContainer = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing()};
  flex-grow: 1;
  flex-wrap: wrap;
`

const EventTypeOuter = styled.div`
  margin: ${({ theme }) => theme.spacing([0.5, 1])};
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 15%;
  background: ${({ theme }) => theme.color('background')};
  display: flex;
  flex-direction: column;
  max-width: ${({ theme }) => theme.spacing(40)};
`

const EventPropertiesInner = styled.div`
  padding: ${({ theme }) => theme.spacing()};
  width: 100%;
  white-space: nowrap;
`

const EventTypeSection = styled.div`
  padding: ${({ theme }) => theme.spacing()};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const EventTypeName = styled.h4`
  ${({ theme }) => theme.text('heading', 'small')};
  white-space: nowrap;
`

const EventCount = styled.div`
  ${({ theme }) => theme.text('label', 'small')};
  margin: ${({ theme }) => theme.spacing(1)};
  white-space: nowrap;
`

const EventPropertiesSection = styled.div`
  background: ${({ theme }) => theme.color('background', 1)};
  ${({ theme }) => theme.text('label', 'small')};
  color: ${({ theme, hasFilters }) =>
    theme.color(hasFilters ? 'highlight' : 'text', 1)};
`

function EventsTypeControls({ events, propertyTypes, dispatchPropertyTypes }) {
  const websocketData = useContext(WebsocketContext)
  const eventTypesRef = useRef({
    requestedTypes: [],
    propertiesFromEvents: {},
  })
  const runtime = useContext(RuntimeContext)
  const filters = useContext(FilterContext)
  console.log(filters)

  const eventTypes = runtime ? getRuntimeEventTypes(runtime) : []

  const initialEventTypesCount = eventTypes.reduce((types, { name }) => {
    types[name] = 0
    return types
  }, {})

  const eventTypeCounts = events.reduce((types, event) => {
    const eventType = event.getType()
    const eventTypeName = eventType.getName()

    const eventTypeProperties = eventType.getPropertyTypesList()
    const hasProperties = eventTypeProperties && eventTypeProperties.length
    if (eventTypeProperties) {
      eventTypesRef.current.propertiesFromEvents[eventTypeName] = hasProperties
        ? eventTypeProperties
        : null
    }

    if (!types[eventTypeName]) {
      types[eventTypeName] = 1
    } else {
      types[eventTypeName]++
    }
    return types
  }, initialEventTypesCount)

  const eventTypesbyFrequency = Object.entries(eventTypeCounts)

  // Sort alphabetically to avoid dancing around as live data comes in
  eventTypesbyFrequency.sort((a, b) => (a[0] < b[0] ? -1 : 1))

  useEffect(() => {
    if (!websocketData) return
    // Request a new runtime from the server the first time we see an
    // event type that we don't have metadata for
    const newMissingTypes = eventTypesbyFrequency.filter(
      ([name]) =>
        !getEventTypeMetadata(name, eventTypes) &&
        !eventTypesRef.current.requestedTypes.includes(name) &&
        !eventTypesRef.current.propertiesFromEvents[name]
    )

    if (newMissingTypes.length) {
      eventTypesRef.current.requestedTypes = [
        ...eventTypesRef.current.requestedTypes,
        ...newMissingTypes.map(([name]) => name),
      ]
      websocketData.sendCommand('request', {
        source: proto.ClientCommand.Source.RUNTIME,
      })
    }
  }, [eventTypes, eventTypesbyFrequency, websocketData, eventTypesRef])

  return (
    <EventTypesContainer>
      {eventTypesbyFrequency.map(([name, count]) => {
        let isMissing = false
        let propertyData = getEventPropertyData(
          name,
          eventTypes,
          propertyTypes,
          eventTypesRef.current.propertiesFromEvents
        )

        if (!propertyData) {
          isMissing = true
          propertyData = []
        }
        const filteredProperties = propertyData.filter(
          propStatus => !propStatus.enabled
        )
        const hasFilters = !!filteredProperties.length

        const TooltipContent = isMissing ? (
          `No event properties metadata available for event type "${name}"`
        ) : (
          <EventTypesPropertyControls
            eventName={name}
            propertyData={propertyData}
            propertyTypes={propertyTypes}
            dispatchPropertyTypes={dispatchPropertyTypes}
          />
        )

        return (
          <EventTypeOuter key={name}>
            <EventTypeSection>
              <EventTypeName>
                <Icon type={'check'} />
                <Monospace>{name}</Monospace>
              </EventTypeName>
              <EventCount>{count} events</EventCount>
            </EventTypeSection>
            <EventPropertiesSection hasFilters={hasFilters}>
              <Tooltip
                side="bottom"
                toleranceY={null}
                fixOn="no-hover"
                content={TooltipContent}
                expandIcon
                override={{ Target: EventPropertiesInner }}
              >
                {propertyData.length} column
                {propertyData.length === 1 ? '' : 's'},{' '}
                {filteredProperties.length} hidden
              </Tooltip>
            </EventPropertiesSection>
          </EventTypeOuter>
        )
      })}
    </EventTypesContainer>
  )
}

EventsTypeControls.propTypes = {
  events: T.array.isRequired,
  propertyTypes: T.array.isRequired,
  dispatchPropertyTypes: T.func.isRequired,
}

export default EventsTypeControls
