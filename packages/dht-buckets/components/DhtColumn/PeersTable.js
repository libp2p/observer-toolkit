import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  DataTable,
  useTabularData,
  PeerIdChip,
  getStringSorter,
  getNumericSorter,
} from '@nearform/observer-sdk'

import PeersTableRow from './PeersTableRow'

const stringSorter = {
  getSorter: getStringSorter,
  defaultDirection: 'asc',
}

const numericSorter = {
  getSorter: getNumericSorter,
  defaultDirection: 'desc',
}

const Container = styled.div`
  width: 640px;
  max-height: 500px;
  padding: ${({ theme }) => theme.spacing()};
  overflow: auto;
`

const PeerIdCell = ({ value }) => <PeerIdChip peerId={value} />
PeerIdCell.propTypes = {
  value: T.string.isRequired,
}

const columnsDef = [
  {
    name: 'peerId',
    header: 'Peer ID',
    getProps: peer => ({ value: peer.peerId }),
    renderContent: PeerIdCell,
    sort: stringSorter,
    rowKey: 'peerId',
  },
  {
    name: 'time',
    header: 'Time in bucket',
    getProps: peer => ({ value: peer.age }),
    sort: numericSorter,
  },
]

function PeersTable({ peers }) {
  const rowsPerPageOptions = [5, 10, 25, 50, 100]

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
    columns: columnsDef,
    data: peers,
    defaultSort: 'time',
  })

  return (
    <Container>
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
        hasSlidingRows={false}
        rowsPerPageOptions={rowsPerPageOptions}
        override={{ DataTableRow: PeersTableRow }}
      />
    </Container>
  )
}

PeersTable.propTypes = {
  peers: T.array.isRequired,
}

export default PeersTable
