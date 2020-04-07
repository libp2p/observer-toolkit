import {
  getConnectionAge,
  getConnectionTimeClosed,
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

import ConnectionStreamsContent from '../components/StreamsSubtable/ConnectionStreamsContent'

import * as statusSorter from '../utils/statusSorter'

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
  rowKey: 'value',
}

const dataInCol = {
  name: 'data-in',
  header: 'Data in',
  getProps: (connection, metadata) => ({
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
  getProps: (connection, metadata) => ({
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
  getProps: (connection, { timepoint, maxAge }) => {
    const age = getConnectionAge(connection, timepoint)
    return {
      value: age,
      maxValue: maxAge,
    }
  },
  renderContent: AgeContent,
  sort: numericSorter,
  align: 'right',
}

const closedCol = {
  name: 'closed',
  header: 'Time closed',
  getProps: (connection, { timepoint, maxAge }) => {
    const age = getConnectionTimeClosed(connection, timepoint)
    return {
      value: age,
      maxValue: maxAge,
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
    connection,
  }),
  sort: numericSorter,
  renderContent: ConnectionStreamsContent,
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
  getProps: (connection, { timepoint }) => {
    const status = statusNames[connection.getStatus()]
    const timeOpen = getConnectionAge(connection, timepoint)
    const timeClosed = getConnectionTimeClosed(connection, timepoint)
    return {
      value: status,
      sortValue: [status, timeOpen, timeClosed],
    }
  },
  renderContent: StatusContent,
  sort: statusSorter,
}

// Define column order

const columns = [
  statusCol,
  peerIdCol,
  transportCol,
  ageCol,
  closedCol,
  dataInCol,
  dataOutCol,
  streamsCol,
]

export default columns
