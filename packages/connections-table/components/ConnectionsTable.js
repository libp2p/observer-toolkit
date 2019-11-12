import React, { useContext } from 'react'

import { getConnections } from '@libp2p-observer/proto'
import { DataTable, TimeContext, useTabularData } from '@libp2p-observer/sdk'

import ConnectionsTableRow from './ConnectionsTableRow'
import connectionsColumnDefs from '../definitions/connectionsColumns'

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
      sortColumn={sortColumn}
      setSortColumn={setSortColumn}
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
      override={{ DataTableRow: ConnectionsTableRow }}
    />
  )
}

export default ConnectionsTable
