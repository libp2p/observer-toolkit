import {
  getStreamAge,
  getStreamTraffic,
  statusNames,
  transportNames,
} from '@nearform/observer-data'
import { getStringSorter, getNumericSorter } from '@nearform/observer-sdk'

import {
  AgeContent,
  BytesContent,
  PeerIdContent,
  StatusContent,
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

// TODO: fix this, calculation incorrect for mock streams
/* eslint-disable no-unused-vars */
const ageCol = {
  name: 'age',
  header: 'Time open',
  getProps: ({ stream }, { state }) => {
    const time = state.getInstantTs()
    const openTs = stream.getTimeline().getOpenTs()
    const closeTs = stream.getTimeline().getCloseTs()
    const age = getStreamAge(stream, state)
    return { value: age }
  },
  renderContent: AgeContent,
  sort: numericSorter,
  align: 'right',
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
  renderContent: StatusContent,
  sort: statusSorter,
}

// Define column order
const columns = [
  streamStatusCol,
  protocolCol,
  dataInCol,
  dataOutCol,
  transportCol,
  peerIdCol,
  // ageCol,
]

export default columns
