import React, { useContext, useMemo } from 'react'

import { getAllStreamsAtTime, getStreamTraffic } from '@libp2p-observer/data'
import {
  DataTable,
  DataContext,
  TimeContext,
  useTabularData,
} from '@libp2p-observer/sdk'

import streamsColumnDefs from '../definitions/streamsColumns'

function getMaxValues(timepoints) {
  const maxValues = timepoints.reduce(
    (maxValues, timepoint) =>
      getAllStreamsAtTime(timepoint).reduce((timeMax, { stream }) => {
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
  const timepoint = useContext(TimeContext)
  const streamsData = getAllStreamsAtTime(timepoint)

  const timepoints = useContext(DataContext)
  const metadata = useMemo(() => getMaxValues(timepoints), [timepoints])

  const {
    columnDefs,
    contentProps,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
  } = useTabularData({
    columns: streamsColumnDefs,
    data: streamsData,
    defaultSort: 'stream-status',
    metadata,
  })

  return (
    <DataTable
      contentProps={contentProps}
      columnDefs={columnDefs}
      sortColumn={sortColumn}
      setSortColumn={setSortColumn}
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
    />
  )
}

export default StreamsTable
