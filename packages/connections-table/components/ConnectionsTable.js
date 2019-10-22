import React, { useContext, useMemo } from 'react'

import { getConnections } from 'proto'
import { DataTable, TimeContext, useTabularData } from 'sdk'

import ConnectionsTableRow from './ConnectionsTableRow'
import connectionsColumnDefs from '../utils/connectionsColumnDefs'

function ConnectionsTable() {
  const timepoint = useContext(TimeContext)

  const {
    columnDefs,
    tableContentProps,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
  } = useTabularData({
    columns: connectionsColumnDefs,
    data: getConnections(timepoint),
    defaultSort: 'status',
  })

  return (
    <DataTable
      tableContentProps={tableContentProps}
      columnDefs={columnDefs}
      TableRow={ConnectionsTableRow}
      sortColumn={sortColumn}
      setSortColumn={setSortColumn}
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
    />
  )
}

export default ConnectionsTable
