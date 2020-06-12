import {
  getConnectionAge,
  getConnectionTimeClosed,
  getConnectionTraffic,
  getStateTimes,
  statusNames,
} from '@nearform/observer-data'
import { getStringSorter, getNumericSorter } from '@nearform/observer-sdk'

import {
  AgeContent,
  BytesContent,
  PeerIdContent,
  StatusContent,
  TimeContent,
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
  getProps: connection => ({
    value: connection.getPeerId(),
    rowKey: `${connection.getPeerId()}_${connection.getId()}`,
  }),
  renderContent: PeerIdContent,
  sort: stringSorter,
  rowKey: 'rowKey',
}

const dataInCol = {
  name: 'data-in',
  header: 'Total data in',
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
  header: 'Total data out',
  getProps: (connection, metadata) => ({
    value: getConnectionTraffic(connection, 'out', 'bytes'),
    maxValue: metadata.maxTraffic,
    colorKey: 'secondary',
  }),
  renderContent: BytesContent,
  sort: numericSorter,
  align: 'right',
}

const bwIn = {
  name: 'bw-in',
  header: 'Bandwidth in',
  getProps: connection => ({
    value: getConnectionTraffic(connection, 'in', 'instBw'),
  }),
  renderContent: BytesContent,
  sort: numericSorter,
  align: 'right',
}

const bwOut = {
  name: 'bw-out',
  header: 'Bandwidth out',
  getProps: connection => ({
    value: getConnectionTraffic(connection, 'out', 'instBw'),
  }),
  renderContent: BytesContent,
  sort: numericSorter,
  align: 'right',
}

const ageCol = {
  name: 'age',
  header: 'Duration open',
  getProps: (connection, { state, maxAge }) => {
    const age = getConnectionAge(connection, state)
    return {
      value: age,
      maxValue: maxAge,
    }
  },
  renderContent: AgeContent,
  sort: numericSorter,
  align: 'right',
}

const openCol = {
  name: 'open',
  header: 'Time opened',
  getProps: connection => {
    const openTs = connection.getTimeline().getOpenTs()
    return { value: openTs }
  },
  renderContent: TimeContent,
  sort: numericSorter,
  align: 'right',
}

const closedCol = {
  name: 'closed',
  header: 'Time closed',
  getProps: connection => {
    const closeTs = connection.getTimeline().getCloseTs()
    return { value: closeTs }
  },
  renderContent: TimeContent,
  sort: numericSorter,
  align: 'right',
}

const streamsCol = {
  name: 'streams',
  getProps: (connection, { hidePrevious }) => ({
    value: connection.getStreams().getStreamsList().length,
    connection,
    hidePrevious,
  }),
  sort: numericSorter,
  renderContent: ConnectionStreamsContent,
  align: 'right',
}

const statusCol = {
  name: 'status',
  getProps: (connection, { state }) => {
    const status = statusNames[connection.getStatus()]
    const timeOpen = getConnectionAge(connection, state)
    const timeClosed = getConnectionTimeClosed(connection, state)
    const { duration } = getStateTimes(state)
    return {
      value: status,
      sortValue: [status, timeOpen, timeClosed],
      timeOpen,
      timeClosed,
      duration,
    }
  },
  renderContent: StatusContent,
  sort: statusSorter,
}

// Define column order

const columns = [
  statusCol,
  peerIdCol,
  ageCol,
  openCol,
  closedCol,
  dataInCol,
  bwIn,
  dataOutCol,
  bwOut,
  streamsCol,
]

export default columns
