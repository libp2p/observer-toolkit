import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { getTime, getTimeIndex } from '@libp2p-observer/data'
import { DataContext, TimeContext } from '@libp2p-observer/sdk'

const ExampleStyledHeader = styled.h2`
  ${({ theme }) => theme.text('body', 'large')}
`

const ExampleStyledContent = styled.div`
  background: ${({ theme }) => theme.color('light', 'mid')};
  border-radius: ${({ theme }) => theme.spacing()};
  padding: ${({ theme }) => theme.spacing(2)};
`

function $WIDGET_COMPONENT({ children }) {
  // Function component logic here
  // Use the React Hooks model, see https://reactjs.org/docs/hooks-intro.html
  const timepoints = useContext(DataContext)
  const currentTimepoint = useContext(TimeContext)

  const time = getTime(currentTimepoint)
  const timeIndex = getTimeIndex(timepoints, time)

  /* eslint-disable-next-line no-console */
  console.log(time, currentTimepoint, timepoints)

  return (
    <ExampleStyledContent>
      <ExampleStyledHeader>Hello $WIDGET_COMPONENT</ExampleStyledHeader>
      <p>
        Currently selected time point {timeIndex + 1} of {timepoints.length}
        reffering to {new Date(time).toLocaleString()}. Open console to inspect.
      </p>
      {children}
    </ExampleStyledContent>
  )
}

$WIDGET_COMPONENT.propTypes = {
  children: T.node,
}

export default $WIDGET_COMPONENT
