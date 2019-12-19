import React from 'react'
import T from 'prop-types'

import {
  getListFilter,
  getRangeFilter,
  useCalculation,
  FilterProvider,
} from '@libp2p-observer/sdk'
import { getConnections, getStreams, statusNames } from '@libp2p-observer/data'

const statusNamesList = Object.values(statusNames)

function WidgetContext({ children }) {
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

  return <FilterProvider filterDefs={filterDefs}>{children}</FilterProvider>
}

WidgetContext.propTypes = {
  children: T.node,
}

export default WidgetContext
