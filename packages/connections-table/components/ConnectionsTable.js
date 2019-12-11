import React, { useContext, useMemo } from 'react'

import {
  getConnections,
  getConnectionTraffic,
  getConnectionAge,
} from '@libp2p-observer/data'
import {
  DataTable,
  DataContext,
  TimeContext,
  useTabularData,
} from '@libp2p-observer/sdk'

import ConnectionsTableRow from './ConnectionsTableRow'
import connectionsColumnDefs from '../definitions/connectionsColumns'

function getMaxValues(timepoints) {
  const maxValues = timepoints.reduce(
    (maxValues, timepoint) =>
      getConnections(timepoint).reduce((timeMax, connection) => {
        const { maxTraffic, maxAge } = timeMax
        const dataIn = getConnectionTraffic(connection, 'in', 'bytes')
        const dataOut = getConnectionTraffic(connection, 'out', 'bytes')
        const age = getConnectionAge(connection, timepoint)
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

function ConnectionsTable() {
  const timepoint = useContext(TimeContext)
  const timepoints = useContext(DataContext)

  // If performance becomes an issue on live-streaming data, use
  // useReducer and compare appended data only instead of whole dataset
  const metadata = useMemo(() => getMaxValues(timepoints), [timepoints])

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
      override={{ DataTableRow: ConnectionsTableRow }}
    />
  )
}

export default ConnectionsTable
