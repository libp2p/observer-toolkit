import React, { useContext, useMemo } from 'react'

import {
  DataContext,
  DataTable,
  TimeContext,
  useHidePrevious,
  useTabularData,
} from '@libp2p-observer/sdk'
import {
  getConnections,
  getMissingClosedConnections,
} from '@libp2p-observer/data'

import ConnectionsTableRow from './ConnectionsTableRow'
import connectionsColumnDefs from '../definitions/connectionsColumns'
import { MetadataContext } from './context/MetadataProvider'

function ConnectionsTable() {
  const currentState = useContext(TimeContext)
  const states = useContext(DataContext)
  const metadata = useContext(MetadataContext)
  const hidePrevious = useHidePrevious()

  const allConnections = useMemo(() => {
    const connections = getConnections(currentState)
    const missingConnections = getMissingClosedConnections(currentState, states)
    return [...connections, ...missingConnections]
  }, [currentState, states])

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
    data: allConnections,
    defaultSort: 'status',
    metadata: {
      timepoint: currentState,
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
