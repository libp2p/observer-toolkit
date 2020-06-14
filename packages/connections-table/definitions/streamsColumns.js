import {
  getStreamAge,
  getStreamTimeClosed,
  getStreamTraffic,
  statusNames,
} from '@libp2p/observer-data'
import {
  getStringSorter,
  getNumericSorter,
  BytesContent,
  TimeContent,
  ProtocolChip,
  StatusContent,
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

const openCol = {
  name: 'open',
  header: 'Time opened',
  getProps: (stream) => {
    const openTs = stream.getTimeline().getOpenTs()
    return { value: openTs }
  },
  renderContent: TimeContent,
  sort: numericSorter,
  align: 'right',
}

const dataInCol = {
  name: 'data-in',
  header: 'Data in',
  getProps: (stream, metadata) => ({
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
  getProps: (stream, metadata) => ({
    value: getStreamTraffic(stream, 'in', 'bytes'),
    maxValue: metadata.maxTraffic,
    colorKey: 'secondary',
  }),
  renderContent: BytesContent,
  sort: numericSorter,
  align: 'right',
}


const protocolCol = {
  name: 'protocol',
  getProps: stream => ({ value: stream.getProtocol() }),
  renderContent: ProtocolChip,
  sort: stringSorter,
  cellProps: {
    width: '40%',
  },
}

const streamStatusCol = {
  name: 'stream-status',
  header: 'status',
  getProps: (stream, { state }) => {
    const status = statusNames[stream.getStatus()]
    const timeOpen = getStreamAge(stream, state)
    const timeClosed = getStreamTimeClosed(stream, state)
    return {
      value: status,
      sortValue: [status, timeOpen, timeClosed],
      id: stream.getId(),
    }
  },
  renderContent: StatusContent,
  sort: statusSorter,
  rowKey: 'id',
}

// Define column order
const columns = [streamStatusCol, protocolCol, openCol, dataInCol, dataOutCol]

export default columns
