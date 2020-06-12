import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { getEventType, getRuntimeEventTypes } from '@libp2p/observer-data'
import { RuntimeContext, Monospace, Tooltip } from '@libp2p/observer-sdk'

import EventTypesPropertyControls from './EventTypesPropertyControls'

function getEventPropertyData(eventName, eventTypes, propertyTypes) {
  const eventType = eventTypes.find(type => type.name === eventName)

  /* istanbul ignore next: unreachable unless a bug is introduced */
  if (!eventType)
    throw new Error(
      `Runtime does not have event type "${eventName}"; has "${eventTypes
        .map(type => type.name)
        .join('", "')}"`
    )

  const eventPropertyData = eventType.properties.reduce(
    (propertyData, property) => {
      const propertyStatus = propertyTypes.find(
        propStatus => propStatus.name === property.name
      )

      // Is typically missing on first pass before effect updates hook state
      if (!propertyStatus) return propertyData

      return [...propertyData, propertyStatus]
    },
    []
  )
  return eventPropertyData
}

const EventTypesContainer = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing()};
`

const EventType = styled.div`
  white-space: nowrap;
  margin: ${({ theme }) => theme.spacing(0.5)};
  color: ${({ theme, hasFilters }) =>
    theme.color(hasFilters ? 'highlight' : 'text')};
  padding: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.color('background')};
`

const EventTypeColumnSummary = styled.div`
  margin: ${({ theme }) => theme.spacing([0.5, 0])};
  ${({ theme }) => theme.text('label', 'small')};
  color: ${({ theme, hasFilters }) =>
    theme.color(hasFilters ? 'highlight' : 'text', 1)};
`

function EventsTypeControls({ events, propertyTypes, dispatchPropertyTypes }) {
  const runtime = useContext(RuntimeContext)
  if (!runtime) return ''

  const eventTypes = getRuntimeEventTypes(runtime)

  const initialEventTypesCount = eventTypes.reduce((types, { name }) => {
    types[name] = 0
    return types
  }, {})

  const eventTypeCounts = events.reduce((types, event) => {
    const eventType = getEventType(event)
    if (!types[eventType]) {
      types[eventType] = 1
    } else {
      types[eventType]++
    }
    return types
  }, initialEventTypesCount)

  const eventTypesbyFrequency = Object.entries(eventTypeCounts)
  eventTypesbyFrequency.sort((a, b) => (a[0] < b[0] ? -1 : 1))

  return (
    <EventTypesContainer>
      {eventTypesbyFrequency.map(([name, count]) => {
        const propertyData = getEventPropertyData(
          name,
          eventTypes,
          propertyTypes
        )
        const filteredProperties = propertyData.filter(
          propStatus => !propStatus.enabled
        )
        const hasFilters = !!filteredProperties.length

        return (
          <Tooltip
            key={name}
            side="bottom"
            toleranceY={null}
            fixOn="no-hover"
            content={
              <EventTypesPropertyControls
                eventName={name}
                propertyData={propertyData}
                propertyTypes={propertyTypes}
                dispatchPropertyTypes={dispatchPropertyTypes}
              />
            }
          >
            <EventType hasFilters={hasFilters}>
              {count} <Monospace>{name}</Monospace>
              <EventTypeColumnSummary hasFilters={hasFilters}>
                {propertyData.length} column
                {propertyData.length === 1 ? '' : 's'},{' '}
                {filteredProperties.length} hidden
              </EventTypeColumnSummary>
            </EventType>
          </Tooltip>
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
