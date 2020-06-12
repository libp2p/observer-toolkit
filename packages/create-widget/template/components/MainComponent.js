import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { getStateTimes, getStateIndex } from '@libp2p/observer-data'
import {
  DataContext,
  EventsContext,
  FilterContext,
  TimeContext,
} from '@libp2p/observer-sdk'

const ExampleStyledHeader = styled.h2`
  ${({ theme }) => theme.text('body', 'large')}
`

const ExampleStyledContent = styled.article`
  background: ${({ theme }) => theme.color('background', 1)};
  border-radius: ${({ theme }) => theme.spacing()};
  padding: ${({ theme }) => theme.spacing(2)};
`

function $WIDGET_COMPONENT({ children }) {
  // Function component logic here
  // Use the React Hooks model, see https://reactjs.org/docs/hooks-intro.html
  const states = useContext(DataContext)
  const currentState = useContext(TimeContext)
  const events = useContext(EventsContext)
  const { applyFilters } = useContext(FilterContext)

  if (!states.length) return 'Awaiting data...'

  const { start, end } = getStateTimes(currentState)
  const timeIndex = getStateIndex(states, end)

  const filteredEvents = events
    .filter(applyFilters)
    .filter(event => event.getTs() < end)

  return (
    <ExampleStyledContent>
      <ExampleStyledHeader>Hello $WIDGET_COMPONENT</ExampleStyledHeader>
      <p>
        State message <b>{timeIndex + 1}</b> of {states.length} is selected,
        containing data from <b>{new Date(start).toLocaleString()}</b> to{' '}
      </p>
      <p>Open your browser's console to explore all available data.</p>

      <p>
        {filteredEvents.length} events are available to the widget with current
        selections.
      </p>

      {children}
    </ExampleStyledContent>
  )
}

$WIDGET_COMPONENT.propTypes = {
  children: T.node,
}

export default $WIDGET_COMPONENT
