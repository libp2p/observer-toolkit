import {
  getAge,
  getTime,
  getTraffic,
  statusNames,
  transportNames,
} from '@libp2p-observer/data'
import {
  getStringSorter,
  getNumericSorter,
  getRangeFilter,
} from '@libp2p-observer/sdk'

import {
  AgeContent,
  BytesContent,
  PeerIdContent,
} from '../components/cellContent'

import * as statusSorter from '../utils/statusSorter'
import statusFilter from '../utils/statusFilter'

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
  getProps: connection => ({
    value: getTraffic(connection, 'in', 'bytes'),
    label: 'inbound',
  }),
  renderContent: BytesContent,
  sort: numericSorter,
}

const dataOutCol = {
  name: 'data-out',
  header: 'Data out',
  getProps: connection => ({
    value: getTraffic(connection, 'out', 'bytes'),
    label: 'outbound',
  }),
  renderContent: BytesContent,
  sort: numericSorter,
}

const ageCol = {
  name: 'age',
  header: 'Time open',
  getProps: (connection, timepoint) => {
    const time = getTime(timepoint)
    const openTs = connection.getTimeline().getOpenTs()
    const closeTs = connection.getTimeline().getCloseTs()
    const age = getAge(time, openTs, closeTs)
    return { value: age }
  },
  renderContent: AgeContent,
  sort: numericSorter,
}

const streamsCol = {
  name: 'streams',
  getProps: connection => ({
    value: connection.getStreams().getStreamsList().length,
  }),
  sort: numericSorter,
  calculate: {
    filter: column =>
      getRangeFilter({
        min: 0,
        max: getMaxValue(column),
        name: 'Filter number of streams',
      }),
  },
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
  sort: statusSorter,
  filter: statusFilter,
}

// Define column order

const columns = [
  peerIdCol,
  dataInCol,
  dataOutCol,
  ageCol,
  streamsCol,
  transportCol,
  statusCol,
]

export default columns
