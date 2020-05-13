import React from 'react'
import T from 'prop-types'

import {
  dhtQueryDirectionNames,
  dhtQueryResultNames,
} from '@nearform/observer-data'
import {
  getListFilter,
  getRangeFilter,
  FilterProvider,
} from '@nearform/observer-sdk'

import { DhtQueryProvider } from './DhtQueryProvider'
import { PeerSlotsProvider } from './PeerSlotsProvider'

const directionNamesList = Object.values(dhtQueryDirectionNames)
const resultNamesList = Object.values(dhtQueryResultNames)

function WidgetContext({ children }) {
  const filterDefs = [
    getListFilter({
      name: 'Filter query direction',
      mapFilter: query => query.direction,
      valueNames: directionNamesList,
    }),
    getListFilter({
      name: 'Filter query result',
      mapFilter: query => query.result,
      valueNames: resultNamesList,
    }),
    getRangeFilter({
      name: 'Filter query duration',
      mapFilter: query => query.duration,
      min: 0,
      max: 500, // TODO: See how real libp2p data exposes query limit
    }),
  ]

  return (
    <FilterProvider filterDefs={filterDefs}>
      <PeerSlotsProvider>
        <DhtQueryProvider>{children}</DhtQueryProvider>
      </PeerSlotsProvider>
    </FilterProvider>
  )
}

WidgetContext.propTypes = {
  children: T.node,
}

export default WidgetContext
