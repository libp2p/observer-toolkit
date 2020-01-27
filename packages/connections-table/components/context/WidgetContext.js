import React, { useContext, useMemo } from 'react'
import T from 'prop-types'

import {
  getConnections,
  getConnectionTraffic,
  getConnectionAge,
  getStreams,
  statusNames,
} from '@libp2p-observer/data'
import {
  getListFilter,
  getRangeFilter,
  useCalculation,
  FilterProvider,
  DataContext,
} from '@libp2p-observer/sdk'

import { MetadataProvider } from './MetadataProvider'

const statusNamesList = Object.values(statusNames)

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

function WidgetContext({ children }) {
  const timepoints = useContext(DataContext)

  // If performance becomes an issue on live-streaming data, use
  // useReducer and compare appended data only instead of whole dataset
  const metadata = useMemo(() => getMaxValues(timepoints), [timepoints])

  const maxStreams = useCalculation(
    ({ timepoint }) =>
      getConnections(timepoint).reduce(
        (max, conn) => Math.max(max, getStreams(conn).length),
        0
      ),
    ['timepoint']
  )

  const filterDefs = [
    getListFilter({
      name: 'Filter by status',
      mapFilter: conn => statusNamesList[conn.getStatus()],
      valueNames: statusNamesList,
    }),
    getRangeFilter({
      name: 'Filter number of streams',
      mapFilter: conn => getStreams(conn).length,
      min: 0,
      max: maxStreams,
    }),
  ]

  return (
    <MetadataProvider metadata={metadata}>
      <FilterProvider filterDefs={filterDefs}>{children}</FilterProvider>
    </MetadataProvider>
  )
}

WidgetContext.propTypes = {
  children: T.node,
}

export default WidgetContext
