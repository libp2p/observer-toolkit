import {
  getStreamAge,
  getStreamTraffic,
  statusNames,
} from '@libp2p/observer-data'
import {
  getStringSorter,
  getNumericSorter,
  BytesContent,
  DurationContent,
  ProtocolChip,
  PeerIdContent,
  StatusContent,
  TimeContent,
} from '@libp2p/observer-sdk'

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
  getProps: ({ connection, stream }) => ({
    value: connection.getPeerId(),
    rowKey: connection.getPeerId() + ':' + stream.getId().toString(),
  }),
  renderContent: PeerIdContent,
  sort: stringSorter,
  rowKey: 'rowKey',
}

const dataInCol = {
  name: 'data-in',
  header: 'Data in',
  getProps: ({ stream }, metadata) => ({
    value: getStreamTraffic(stream, 'in', 'bytes'),
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
  getProps: ({ stream }, metadata) => ({
    value: getStreamTraffic(stream, 'in', 'bytes'),
    maxValue: metadata.maxTraffic,
    colorKey: 'secondary',
  }),
  renderContent: BytesContent,
  sort: numericSorter,
  align: 'right',
}

const ageCol = {
  name: 'age',
  header: 'Duration open',
  getProps: ({ stream }, { currentState, maxAge }) => {
    const age = getStreamAge(stream, currentState)
    return { value: age, maxValue: maxAge }
  },
  renderContent: DurationContent,
  sort: numericSorter,
  align: 'right',
}

const openCol = {
  name: 'open',
  header: 'Time opened',
  getProps: ({ stream }) => {
    const openTs = stream.getTimeline().getOpenTs()
    return { value: openTs }
  },
  renderContent: TimeContent,
  sort: numericSorter,
  align: 'right',
}

const protocolCol = {
  name: 'protocol',
  getProps: ({ stream }) => ({ value: stream.getProtocol() }),
  renderContent: ProtocolChip,
  sort: stringSorter,
  cellProps: {
    width: '25%',
  },
}

const streamStatusCol = {
  name: 'stream-status',
  header: 'status',
  getProps: ({ stream }) => ({ value: statusNames[stream.getStatus()] }),
  renderContent: StatusContent,
  sort: statusSorter,
}

// Define column order
const columns = [
  peerIdCol,
  streamStatusCol,
  protocolCol,
  ageCol,
  openCol,
  dataInCol,
  dataOutCol,
]

export default columns
