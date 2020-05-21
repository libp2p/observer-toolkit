import React, { useContext, useMemo } from 'react'

import {
  getAllStreamsAtTime,
  getStreamAge,
  getStreamTraffic,
} from '@libp2p/observer-data'
import {
  DataTable,
  DataContext,
  TimeContext,
  useTabularData,
} from '@libp2p/observer-sdk'

import streamsColumnDefs from '../definitions/streamsColumns'

function getMaxValues(states, currentState) {
  const maxValues = states.reduce(
    (maxValues, state) =>
      getAllStreamsAtTime(state).reduce((timeMax, { stream }) => {
        const { maxTraffic, maxAge } = timeMax
        const dataIn = getStreamTraffic(stream, 'in', 'bytes')
        const dataOut = getStreamTraffic(stream, 'out', 'bytes')
        const age = getStreamAge(stream, state)
        return {
          maxTraffic: Math.max(maxTraffic, dataIn, dataOut),
          maxAge: Math.max(maxAge, age),
        }
      }, maxValues),
    {
      maxTraffic: 0,
      maxAge: 0,
    }
  )
  return maxValues
}

function StreamsTable() {
  const currentState = useContext(TimeContext)
  const streamsData = getAllStreamsAtTime(currentState)

  const states = useContext(DataContext)
  const maxValues = useMemo(() => getMaxValues(states), [states])
  const metadata = useMemo(() => ({ ...maxValues, currentState }), [
    maxValues,
    currentState,
  ])

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
