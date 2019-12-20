import React, { useContext } from 'react'
import T from 'prop-types'

import { getStreams } from '@libp2p-observer/data'
import { DataTable, useTabularData } from '@libp2p-observer/sdk'

import { MetadataContext } from '../context/MetadataProvider'
import streamsColumnDefs from '../../definitions/streamsColumns'

function StreamsSubTable({ connection }) {
  const metadata = useContext(MetadataContext)

  const {
    columnDefs,
    contentProps,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
  } = useTabularData({
    columns: streamsColumnDefs,
    data: getStreams(connection),
    defaultSort: 'stream-status',
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
    />
  )
}

StreamsSubTable.propTypes = {
  connection: T.object,
}

export default StreamsSubTable
