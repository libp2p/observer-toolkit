import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  DataTable,
  useTabularData,
  PeerIdChip,
  getStringSorter,
  getNumericSorter,
} from '@libp2p-observer/sdk'

const stringSorter = {
  getSorter: getStringSorter,
  defaultDirection: 'asc',
}

const numericSorter = {
  getSorter: getNumericSorter,
  defaultDirection: 'desc',
}

const Container = styled.div`
  width: 300px;
  max-height: 400px;
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
    getProps: peer => ({ value: peer.getPeerId() }),
    renderContent: PeerIdCell,
    sort: stringSorter,
    rowKey: 'peerId',
  },
  {
    name: 'time',
    header: 'Time in bucket',
    getProps: peer => ({ value: peer.getAgeInBucket() }),
    sort: numericSorter,
  },
]

function CandidatePeersTable({ candidatePeers }) {
  console.log('candidatePeers', candidatePeers)

  const {
    columnDefs,
    contentProps,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
  } = useTabularData({
    columns: columnsDef,
    data: candidatePeers,
    defaultSort: 'time',
  })

  return (
    <Container>
      <DataTable
        contentProps={contentProps}
        columnDefs={columnDefs}
        sortColumn={sortColumn}
        setSortColumn={setSortColumn}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
    </Container>
  )
}

CandidatePeersTable.propTypes = {
  candidatePeers: T.array.isRequired,
}

export default CandidatePeersTable
