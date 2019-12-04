import {
  getAge,
  getTraffic,
  statusNames,
  transportNames,
} from '@libp2p-observer/data'
import { getStringSorter, getNumericSorter } from '@libp2p-observer/sdk'

import {
  AgeContent,
  BytesContent,
  PeerIdContent,
} from '../components/cellContent'

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
  getProps: ({ connection }) => ({ value: connection.getPeerId() }),
  renderContent: PeerIdContent,
  sort: stringSorter,
}

const transportCol = {
  name: 'transport',
  getProps: ({ connection }) => {
    const transportIdBin = connection.getTransportId()
    const transportIdInt = Buffer.from(transportIdBin).readUIntLE(
      0,
      transportIdBin.length
    )
    return { value: transportNames[transportIdInt] }
  },
  sort: stringSorter,
}

const dataInCol = {
  name: 'data-in',
  header: 'Data in',
  getProps: ({ stream }) => ({
    value: getTraffic(stream, 'in', 'bytes'),
    label: 'inbound',
  }),
  renderContent: BytesContent,
  sort: numericSorter,
}

const dataOutCol = {
  name: 'data-out',
  header: 'Data out',
  getProps: ({ stream }) => ({
    value: getTraffic(stream, 'out', 'bytes'),
    label: 'outbound',
  }),
  renderContent: BytesContent,
  sort: numericSorter,
}

// TODO: fix this, calculation incorrect for mock streams
/* eslint-disable no-unused-vars */
const ageCol = {
  name: 'age',
  header: 'Time open',
  getProps: ({ stream }, timepoint) => {
    const time = timepoint.getInstantTs()
    const openTs = stream.getTimeline().getOpenTs()
    const closeTs = stream.getTimeline().getCloseTs()
    const age = getAge(time, openTs, closeTs)
    return { value: age }
  },
  renderContent: AgeContent,
  sort: numericSorter,
}
/* eslint-enable no-unused-vars */

const protocolCol = {
  name: 'protocol',
  getProps: ({ stream }) => ({ value: stream.getProtocol() }),
  sort: stringSorter,
}

const streamStatusCol = {
  name: 'stream-status',
  header: 'status',
  getProps: ({ stream }) => ({ value: statusNames[stream.getStatus()] }),
  sort: statusSorter,
}

// Define column order
const columns = [
  peerIdCol,
  transportCol,
  dataInCol,
  dataOutCol,
  // ageCol,
  protocolCol,
  streamStatusCol,
]

export default columns
