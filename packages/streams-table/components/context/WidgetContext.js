import React from 'react'
import T from 'prop-types'

import { getListFilter, FilterProvider } from '@nearform/observer-sdk'
import { statusNames } from '@nearform/observer-data'

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
