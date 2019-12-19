import {
  getConnectionAge,
  getConnectionTraffic,
  statusNames,
  transportNames,
} from '@libp2p-observer/data'
import { getStringSorter, getNumericSorter } from '@libp2p-observer/sdk'

import {
  AgeContent,
  BytesContent,
  PeerIdContent,
  StatusContent,
} from '../components/cellContent'

import * as statusSorter from '../utils/statusSorter'

function getMaxValue(column) {
  return column.reduce((max, { value }) => Math.max(max, value), 0)
}

const stringSorter = {
  getSorter: getStringSorter,
  defaultDirection: 'asc',
}

const numericSorter = {
  getSorter: getNumericSorter,
  defaultDirection: 'desc',
}

const peerIdCol = {
  name: 'peerId',
  header: 'Peer ID',
  getProps: connection => ({ value: connection.getPeerId() }),
  renderContent: PeerIdContent,
  sort: stringSorter,
}

const dataInCol = {
  name: 'data-in',
  header: 'Data in',
  getProps: (connection, _, metadata) => ({
    value: getConnectionTraffic(connection, 'in', 'bytes'),
    maxValue: metadata.maxTraffic,
    colorKey: 'primary',
  }),
  renderContent: BytesContent,
  sort: numericSorter,
  align: 'right',
}

const dataOutCol = {
  name: 'data-out',
  header: 'Data out',
  getProps: (connection, _, metadata) => ({
    value: getConnectionTraffic(connection, 'out', 'bytes'),
    maxValue: metadata.maxTraffic,
    colorKey: 'secondary',
  }),
  renderContent: BytesContent,
  sort: numericSorter,
  align: 'right',
}

const ageCol = {
  name: 'age',
  header: 'Time open',
  getProps: (connection, timepoint, metadata) => {
    const age = getConnectionAge(connection, timepoint)
    return {
      value: age,
      maxValue: metadata.maxAge,
    }
  },
  renderContent: AgeContent,
  sort: numericSorter,
  align: 'right',
}

const streamsCol = {
  name: 'streams',
  getProps: connection => ({
    value: connection.getStreams().getStreamsList().length,
  }),
  sort: numericSorter,
  align: 'right',
}

const transportCol = {
  name: 'transport',
  getProps: connection => {
    const transportIdBin = connection.getTransportId()
    const transportIdInt = Buffer.from(transportIdBin).readUIntLE(
      0,
      transportIdBin.length
    )
    return { value: transportNames[transportIdInt] }
  },
  sort: stringSorter,
}

const statusCol = {
  name: 'status',
  getProps: connection => ({ value: statusNames[connection.getStatus()] }),
  cellProps: { align: 'left' },
  renderContent: StatusContent,
  sort: statusSorter,
}

// Define column order

const columns = [
  statusCol,
  peerIdCol,
  transportCol,
  ageCol,
  dataInCol,
  dataOutCol,
  streamsCol,
]

export default columns
