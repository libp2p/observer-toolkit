import React, { useContext, useMemo } from 'react'
import T from 'prop-types'

import {
  getConnections,
  getConnectionTraffic,
  getConnectionAge,
  getConnectionTimeClosed,
  getStreams,
  statusNames,
} from '@nearform/observer-data'
import {
  formatDuration,
  formatDataSize,
  getListFilter,
  getRangeFilter,
  useCalculation,
  FilterProvider,
  DataContext,
  TimeContext,
} from '@nearform/observer-sdk'

import { MetadataProvider } from './MetadataProvider'

const statusNamesList = Object.values(statusNames)

function getMaxValues(states) {
  const maxValues = states.reduce(
    (maxValues, state) =>
      getConnections(state).reduce((timeMax, connection) => {
        const { maxTraffic, maxAge } = timeMax
        const dataIn = getConnectionTraffic(connection, 'in', 'bytes')
        const dataOut = getConnectionTraffic(connection, 'out', 'bytes')
        const age = getConnectionAge(connection, state)
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
  const states = useContext(DataContext)
  const currentState = useContext(TimeContext)

  // If performance becomes an issue on live-streaming data, use
  // useReducer and compare appended data only instead of whole dataset
  const metadata = useMemo(() => getMaxValues(states), [states])

  const maxStreams = useCalculation(
    ({ currentState }) =>
      getConnections(currentState).reduce(
        (max, conn) => Math.max(max, getStreams(conn).length),
        0
      ),
    ['currentState']
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
    getRangeFilter({
      name: 'Filter total bytes in',
      mapFilter: conn => getConnectionTraffic(conn, 'in', 'bytes'),
      min: 0,
      max: metadata.maxTraffic,
      format: formatDataSize,
    }),
    getRangeFilter({
      name: 'Filter total bytes out',
      mapFilter: conn => getConnectionTraffic(conn, 'out', 'bytes'),
      min: 0,
      max: metadata.maxTraffic,
      format: formatDataSize,
    }),
    getRangeFilter({
      name: 'Filter miliseconds open',
      mapFilter: conn => getConnectionAge(conn, currentState),
      min: 0,
      max: metadata.maxAge,
      format: formatDuration,
    }),
    getRangeFilter({
      name: 'Filter miliseconds closed',
      mapFilter: conn => getConnectionTimeClosed(conn, currentState),
      min: 0,
      max: metadata.maxAge,
      format: formatDuration,
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
