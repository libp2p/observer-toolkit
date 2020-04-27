import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import { getTime } from '@libp2p-observer/data'
import {
  DataTable,
  EventsContext,
  SourceContext,
  TimeContext,
  StyledButton,
  useTabularData,
  TableHead,
} from '@libp2p-observer/sdk'

import EventsTableRow from './EventsTableRow'
import eventsColumnDefs from '../definitions/eventsColumns'
import useEventPropertyTypes from '../hooks/useEventPropertyTypes'
import buildEventsColumns from '../utils/buildEventsColumns'

const Container = styled.div`
  border: 1px solid
    ${({ theme, hasFocus }) =>
      theme.color(hasFocus ? 'secondary' : 'background')};
`

const PauseControlsBar = styled.section`
  position: sticky;
  top: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ barHeight }) => barHeight}px;
  padding: ${({ theme }) => theme.spacing([1, 0])};
  background: ${({ theme }) => theme.color('secondary', 2)};
  ${({ theme }) => theme.text('body', 'medium')}
`

const PauseControlsBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const PauseControlsItem = styled.div`
  margin: ${({ theme }) => theme.spacing([0, 1])};
`

const EventsHeading = styled.h2`
  ${({ theme }) => theme.text('heading', 'medium')};
  margin: ${({ theme }) => theme.spacing([0, 2])};
`

const EventsTableHead = styled(TableHead)`
  padding-top: 0;
`

function EventsTable({ theme }) {
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [pausedEventsData, setPausedEventsData] = useState([])
  const source = useContext(SourceContext)

  const hasLiveSource = source && source.type === 'live'
  const isLive = hasLiveSource && !isPaused && highlightedRowIndex === null

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

  const changeHighlightedRowIndex = rowIndex => {
    if (rowIndex === highlightedRowIndex) return
    if (typeof rowIndex !== typeof highlightedRowIndex && !isPaused) {
      setPausedEventsData(eventsData)
    }
    setHighlightedRowIndex(rowIndex)
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
    data: !hasLiveSource || isLive ? eventsData : pausedEventsData,
    defaultSort: 'time',
    defaultRange: [0, rowsPerPageOptions[defaultPerPageIndex]],
  })

  const pauseButtonText = isPaused ? 'Unpause' : 'Pause'

  const barHeight = hasLiveSource ? theme.spacing(4, true) : 0

  const pausedText = `Incoming events paused${
    !isPaused && highlightedRowIndex !== null ? ' while row is highlighted' : ''
  }`

  return (
    <>
      {hasLiveSource && (
        <PauseControlsBar height={barHeight}>
          <EventsHeading>{shownContent.length} events</EventsHeading>
          <PauseControlsBlock>
            {isLive ? (
              <PauseControlsItem>Showing all incoming events</PauseControlsItem>
            ) : (
              <>
                <PauseControlsItem>{pausedText}</PauseControlsItem>
                <PauseControlsItem>
                  <StyledButton
                    onClick={() => changePausedState(isPaused)}
                    disabled={!eventsSincePause}
                  >
                    {!eventsSincePause ? (
                      <>No events since pausing</>
                    ) : (
                      <>Show {eventsSincePause} new events</>
                    )}
                  </StyledButton>
                </PauseControlsItem>
              </>
            )}
            <PauseControlsItem>
              <StyledButton onClick={() => changePausedState(!isPaused)}>
                {pauseButtonText}
              </StyledButton>
            </PauseControlsItem>
          </PauseControlsBlock>
        </PauseControlsBar>
      )}
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
        sticky={barHeight || true}
        rowProps={{
          highlightedRowIndex,
          changeHighlightedRowIndex,
        }}
        tbodyProps={{
          onMouseLeave: () => changeHighlightedRowIndex(null),
        }}
        override={{
          TableHead: EventsTableHead,
          DataTableRow: EventsTableRow,
        }}
      />
    </>
  )
}
EventsTable.propTypes = {
  theme: T.object.isRequired,
}

export default withTheme(EventsTable)
