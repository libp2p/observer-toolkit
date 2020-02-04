import React, { useContext } from 'react'

import { DataTable, TimeContext, useTabularData } from '@libp2p-observer/sdk'
import { getConnections } from '@libp2p-observer/data'

import ConnectionsTableRow from './ConnectionsTableRow'
import connectionsColumnDefs from '../definitions/connectionsColumns'
import { MetadataContext } from './context/MetadataProvider'

function ConnectionsTable() {
  const timepoint = useContext(TimeContext)
  const metadata = useContext(MetadataContext)

  const {
    columnDefs,
    contentProps,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
  } = useTabularData({
    columns: connectionsColumnDefs,
    data: getConnections(timepoint),
    defaultSort: 'status',
    metadata: {
      timepoint,
      ...metadata,
    },
  })

  return (
    <DataTable
      contentProps={contentProps}
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
