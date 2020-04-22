import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { getTime } from '@libp2p-observer/data'
import {
  DataTable,
  EventsContext,
  TimeContext,
  StyledButton,
  useTabularData,
} from '@libp2p-observer/sdk'

import eventsColumnDefs from '../definitions/eventsColumns'
import useEventPropertyTypes from '../hooks/useEventPropertyTypes'
import buildEventsColumns from '../utils/buildEventsColumns'

const PauseControlsBar = styled.section`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing([2, 1])};
  padding: ${({ theme }) => theme.spacing([2, 1])};
  background: ${({ theme }) => theme.color('background', 1)};
  ${({ theme }) => theme.text('body', 'medium')}
`

const PauseControlsBlock = styled.div`
  margin: ${({ theme }) => theme.spacing([0, 1])};
`

function EventsTable() {
  const [isPaused, setIsPaused] = useState(false)
  const [pausedEventsData, setPausedEventsData] = useState([])

  const timepoint = useContext(TimeContext)
  const time = getTime(timepoint)

  const hideEventsAfter = time + timepoint.getSnapshotDurationMs() * 1.5

  const allEvents = useContext(EventsContext)
  const eventsData = allEvents.filter(event => event.getTs() <= hideEventsAfter)

  const { propertyTypes, dispatchPropertyTypes } = useEventPropertyTypes()

  const rowsPerPageOptions = [10, 25, 50, 100]
  const defaultPerPageIndex = 0

  const columns = buildEventsColumns(
    eventsColumnDefs,
    propertyTypes,
    dispatchPropertyTypes
  )

  const eventsSincePause = eventsData.length - pausedEventsData.length
  const changePausedState = (pause = true) => {
    setIsPaused(pause)
    setPausedEventsData(eventsData)
  }
  // Re-pause if we've gone back in time so events beyond timepoint get removed
  if (eventsSincePause < 0 && isPaused) changePausedState(true)

  const {
    columnDefs,
    allContent,
    shownContent,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    setRange,
    rowCounts,
  } = useTabularData({
    columns,
    data: isPaused ? pausedEventsData : eventsData,
    defaultSort: 'time',
    defaultRange: [0, rowsPerPageOptions[defaultPerPageIndex]],
  })

  const pauseButtonText = isPaused
    ? 'Unpause adding new events'
    : 'Pause adding new events'

  return (
    <>
      <PauseControlsBar>
        <PauseControlsBlock>
          <StyledButton onClick={() => changePausedState(!isPaused)}>
            {pauseButtonText}
          </StyledButton>
        </PauseControlsBlock>

        <PauseControlsBlock>
          {isPaused ? (
            <StyledButton onClick={() => changePausedState(true)}>
              Add {eventsSincePause} new events
            </StyledButton>
          ) : (
            `Showing all incoming events`
          )}
        </PauseControlsBlock>
      </PauseControlsBar>
      <DataTable
        allContent={allContent}
        shownContent={shownContent}
        columnDefs={columnDefs}
        sortColumn={sortColumn}
        setSortColumn={setSortColumn}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        setRange={setRange}
        rowCounts={rowCounts}
        rowsPerPageOptions={rowsPerPageOptions}
        defaultPerPageIndex={defaultPerPageIndex}
        hasPagination
        hasSlidingRows={false}
      />
    </>
  )
}

export default EventsTable
