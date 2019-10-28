import React, { useContext } from 'react'

import { getAllStreamsAtTime } from 'proto'
import { DataTable, TimeContext, useTabularData } from 'sdk'

import streamsColumnDefs from '../definitions/streamsColumns'

function StreamsTable() {
  const timepoint = useContext(TimeContext)

  const streamsData = getAllStreamsAtTime(timepoint)

  const {
    columnDefs,
    tableContentProps,
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
      tableContentProps={tableContentProps}
      columnDefs={columnDefs}
      sortColumn={sortColumn}
      setSortColumn={setSortColumn}
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
    />
  )
}

export default StreamsTable