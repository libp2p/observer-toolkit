import React from 'react'
import T from 'prop-types'

import { getListFilter, FilterProvider } from '@libp2p-observer/sdk'
import { statusNames } from '@libp2p-observer/data'

const statusNamesList = Object.values(statusNames)

function WidgetContext({ children }) {
  const filterDefs = [
    getListFilter({
      name: 'Filter by status',
      mapFilter: ({ stream }) => statusNamesList[stream.getStatus()],
      valueNames: statusNamesList,
    }),
  ]

  return <FilterProvider filterDefs={filterDefs}>{children}</FilterProvider>
}

WidgetContext.propTypes = {
  children: T.node,
}

export default WidgetContext
