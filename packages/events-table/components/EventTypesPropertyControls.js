import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon } from '@libp2p/observer-sdk'

const CheckIconButton = styled.a`
  border-radius: 50%;
  background: ${({ theme }) => theme.color('background', 0)};
  &:hover {
    background: ${({ theme }) => theme.color('background', 0, 0.5)};
  }
`

const EventsPropertyList = styled.ul`
  margin: 0;
  padding: 0;
  position: relative;
  z-index: 10;
`

const EventsPropertyItem = styled.li`
  list-style: none;
  margin: ${({ theme }) => theme.spacing([0.5, 0])};
  padding: ${({ theme }) => theme.spacing(0.5)};
  cursor: pointer;
  white-space: nowrap;
`

const EventsPropertyName = styled.span`
  margin-left: ${({ theme }) => theme.spacing(1)};
`

function EventsTypePropertyControls({
  eventName,
  propertyData,
  propertyTypes,
  dispatchPropertyTypes,
}) {
  return (
    <EventsPropertyList>
      {propertyData.map(propertyStatus => {
        const { name, enabled } = propertyStatus
        const handleClick = () =>
          dispatchPropertyTypes({
            action: enabled ? 'disable' : 'enable',
            data: propertyStatus,
          })

        return (
          <EventsPropertyItem onClick={handleClick} key={name}>
            <Icon
              active={enabled}
              type={enabled ? 'check' : 'uncheck'}
              override={{ Container: CheckIconButton }}
            />
            <EventsPropertyName>{name}</EventsPropertyName>
          </EventsPropertyItem>
        )
      })}
    </EventsPropertyList>
  )
}

EventsTypePropertyControls.propTypes = {
  eventName: T.string.isRequired,
  propertyData: T.array.isRequired,
  propertyTypes: T.array.isRequired,
  dispatchPropertyTypes: T.func.isRequired,
}

export default EventsTypePropertyControls
