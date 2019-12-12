import React, { useContext } from 'react'

import { getAllStreamsAtTime } from '@libp2p-observer/data'
import { DataTable, TimeContext, useTabularData } from '@libp2p-observer/sdk'

import streamsColumnDefs from '../definitions/streamsColumns'

function StreamsTable() {
  const timepoint = useContext(TimeContext)

  const streamsData = getAllStreamsAtTime(timepoint)

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
