import React, { useCallback } from 'react'
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
const EventsPropertyCheckAll = styled(EventsPropertyItem)`
  border-bottom: 1px solid ${({ theme }) => theme.color('background', 2)};
`

const EventsPropertyName = styled.span`
  margin-left: ${({ theme }) => theme.spacing(1)};
`

const EventsPropertyCheckAllLabel = styled(EventsPropertyName)`
  font-weight: 400;
`

function getAllCheckedStatus(propertyData) {
  let anyChecked = false
  let anyUnchecked = false
  for (const { enabled } of propertyData) {
    if ((enabled && anyUnchecked) || (!enabled && anyChecked)) return 'mixed'
    if (enabled) {
      anyChecked = true
    } else {
      anyUnchecked = true
    }
  }
  return anyChecked ? 'all' : 'none'
}

function getCheckAllVars(allCheckedStatus) {
  switch (allCheckedStatus) {
    case 'all':
      return ['check', 'Showing all columns']
    case 'mixed':
      return ['mixed', 'Showing some columns']
    case 'none':
      return ['uncheck', 'Showing no columns']
  }
}

function EventsTypePropertyControls({
  eventName,
  propertyData,
  propertyTypes,
  dispatchPropertyTypes,
}) {
  const allCheckedStatus = getAllCheckedStatus(propertyData)
  const [checkAllIcon, checkAllText] = getCheckAllVars(allCheckedStatus)
  const buttonChecksAll = checkAllIcon !== 'check'

  const handleCheckAll = useCallback(() => {
    propertyData.forEach(propertyStatus =>
      dispatchPropertyTypes({
        action: buttonChecksAll ? 'enable' : 'disable',
        data: propertyStatus,
      })
    )
  }, [buttonChecksAll, dispatchPropertyTypes, propertyData])

  return (
    <EventsPropertyList>
      <EventsPropertyCheckAll onClick={handleCheckAll}>
        <Icon type={checkAllIcon} override={{ Container: CheckIconButton }} />
        <EventsPropertyCheckAllLabel>
          {checkAllText}
        </EventsPropertyCheckAllLabel>
      </EventsPropertyCheckAll>
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
