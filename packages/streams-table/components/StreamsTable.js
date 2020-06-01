import React, { useContext, useMemo } from 'react'

import { getAllStreamsAtTime, getStreamTraffic } from '@nearform/observer-data'
import {
  DataTable,
  DataContext,
  TimeContext,
  useTabularData,
} from '@nearform/observer-sdk'

import streamsColumnDefs from '../definitions/streamsColumns'

function getMaxValues(states) {
  const maxValues = states.reduce(
    (maxValues, state) =>
      getAllStreamsAtTime(state).reduce((timeMax, { stream }) => {
        const { maxTraffic } = timeMax
        const dataIn = getStreamTraffic(stream, 'in', 'bytes')
        const dataOut = getStreamTraffic(stream, 'out', 'bytes')
        return {
          maxTraffic: Math.max(maxTraffic, dataIn, dataOut),
        }
      }, maxValues),
    {
      maxTraffic: 0,
    }
  )
  return maxValues
}

function StreamsTable() {
  const currentState = useContext(TimeContext)
  const streamsData = getAllStreamsAtTime(currentState)

  const states = useContext(DataContext)
  const metadata = useMemo(() => getMaxValues(states), [states])

  const defaultPerPageIndex = 2

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
    columns: streamsColumnDefs,
    data: streamsData,
    defaultSort: 'stream-status',
    metadata,
  })

  return (
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
      defaultPerPageIndex={defaultPerPageIndex}
      hasPagination
    />
  )
}

export default StreamsTable
