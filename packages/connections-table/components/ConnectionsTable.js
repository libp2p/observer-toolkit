import React, { useContext } from 'react'

import {
  DataTable,
  TimeContext,
  useHidePrevious,
  useTabularData,
} from '@libp2p/observer-sdk'
import { getConnections } from '@libp2p/observer-data'

import ConnectionsTableRow from './ConnectionsTableRow'
import connectionsColumnDefs from '../definitions/connectionsColumns'
import { MetadataContext } from './context/MetadataProvider'

function ConnectionsTable() {
  const timepoint = useContext(TimeContext)
  const metadata = useContext(MetadataContext)
  const hidePrevious = useHidePrevious()

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
    columns: connectionsColumnDefs,
    data: getConnections(timepoint),
    defaultSort: 'status',
    metadata: {
      timepoint,
      hidePrevious,
      ...metadata,
    },
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
      hasPagination
      override={{ DataTableRow: ConnectionsTableRow }}
    />
  )
}

export default ConnectionsTable
