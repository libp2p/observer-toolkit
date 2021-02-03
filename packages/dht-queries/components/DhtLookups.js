import React, { useContext, useMemo } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { getAllDhtLookups, getStateTime } from '@libp2p/observer-data'
import { DataTable, useTabularData, TimeContext } from '@libp2p/observer-sdk'

import lookupColumnDefs from '../definitions/lookupColumns'

import DhtLookupsKey from './DhtLookupsKey'

const Container = styled.div`
  background: ${({ theme, backgroundColorIndex }) =>
    theme.color('background', 1)};
  padding: ${({ theme }) => theme.spacing([1, 0.5])};
`

function DhtLookups({ children }) {
  const currentState = useContext(TimeContext)
  const { dhtLookups } = useMemo(() => {
    if (!currentState) return {}
    const dhtLookups = getAllDhtLookups(currentState)

    return {
      dhtLookups,
    }
  }, [currentState])
  const timestamp = getStateTime(currentState)

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
    columns: lookupColumnDefs,
    data: dhtLookups && dhtLookups.length ? dhtLookups : [],
    defaultSort: 'open',
    metadata: {
      state: currentState,
    },
  })

  if (!currentState || !dhtLookups || !dhtLookups.length) return 'Loading...'

  return (
    <Container>
      <DhtLookupsKey />
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
      />
    </Container>
  )
}

DhtLookups.propTypes = {
  children: T.node,
}

export default DhtLookups
