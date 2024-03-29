import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import { getStateTime } from '@libp2p/observer-data'
import {
  DataTable,
  ConfigContext,
  EventsContext,
  SourceContext,
  TimeContext,
  useHidePrevious,
  useTabularData,
  TableHead,
} from '@libp2p/observer-sdk'

import EventsTableRow from './EventsTableRow'
import EventsControlsBar from './EventsControlsBar'
import eventsColumnDefs from '../definitions/eventsColumns'
import useEventPropertyTypes from '../hooks/useEventPropertyTypes'
import buildEventsColumns from '../utils/buildEventsColumns'

const EventsTableHead = styled(TableHead)`
  padding-top: 0;
`

function EventsTable({ theme }) {
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [pausedEventsData, setPausedEventsData] = useState([])
  const config = useContext(ConfigContext)
  const source = useContext(SourceContext)
  const currentState = useContext(TimeContext)

  const hidePrevious = useHidePrevious()

  const hasLiveSource = source && source.type === 'live'
  const isLoading = source && source.isLoading
  const isLive = hasLiveSource && !isPaused && highlightedRowIndex === null

  const time = currentState ? getStateTime(currentState) : 0

  const snapshotDuration = currentState
    ? currentState.getSnapshotDurationMs()
    : 0
  const hideEventsAfter = time + snapshotDuration * 1.5

  const allEvents = useContext(EventsContext)
  const eventsData = allEvents.filter(event => event.getTs() <= hideEventsAfter)

  const rowsPerPageOptions = [10, 25, 50, 100]
  const defaultPerPageIndex = 0

  const { propertyTypes, dispatchPropertyTypes } = useEventPropertyTypes()

  const columns = buildEventsColumns(
    eventsColumnDefs,
    propertyTypes,
    dispatchPropertyTypes
  )

  const eventsSincePause = eventsData.filter(
    event => !pausedEventsData.includes(event)
  ).length

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

  // Re-pause if we've gone back in time so events beyond currentState get removed
  // if (eventsSincePause < 0 && isPaused) changePausedState(true)

  const currentEventsData =
    !hasLiveSource || isLive ? eventsData : pausedEventsData
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
    data: currentEventsData,
    defaultSort: 'time',
    defaultRange: [0, rowsPerPageOptions[defaultPerPageIndex]],
    metadata: { hidePrevious, currentState, config },
  })

  const barHeight = hasLiveSource ? theme.spacing(4, true) : 0

  // Run all hooks but don't render anything while no data loaded
  if (!currentState || !source || isLoading) return 'Loading...'

  return (
    <>
      <EventsControlsBar
        barHeight={barHeight}
        currentEventsData={currentEventsData}
        hasLiveSource={hasLiveSource}
        isLive={isLive}
        changePausedState={changePausedState}
        eventsSincePause={eventsSincePause}
        isPaused={isPaused}
        highlightedRowIndex={highlightedRowIndex}
        propertyTypes={propertyTypes}
        dispatchPropertyTypes={dispatchPropertyTypes}
      />
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
        sticky={true}
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
