import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { getStreams } from '@libp2p-observer/data'
import { DataTable, useTabularData } from '@libp2p-observer/sdk'

import { MetadataContext } from '../context/MetadataProvider'
import streamsColumnDefs from '../../definitions/streamsColumns'

const PaginationContainer = styled.section`
  bottom: ${({ theme }) => theme.spacing(4)};
`

function StreamsSubTable({ connection }) {
  const metadata = useContext(MetadataContext)

  const rowsPerPageOptions = [5, 10, 25, 50, 100]
  const defaultPerPageIndex = 0
  const defaultRange = [0, rowsPerPageOptions[defaultPerPageIndex]]

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
    columns: streamsColumnDefs,
    data: getStreams(connection),
    defaultSort: 'stream-status',
    defaultRange,
    metadata,
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
      rowsPerPageOptions={rowsPerPageOptions}
      defaultPerPageIndex={defaultPerPageIndex}
      hasPagination
      override={{ PaginationContainer }}
    />
  )
}

StreamsSubTable.propTypes = {
  connection: T.object,
}

export default StreamsSubTable
