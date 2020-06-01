import {
  getStreamAge,
  getStreamTimeClosed,
  getStreamTraffic,
  statusNames,
} from '@nearform/observer-data'
import { getStringSorter, getNumericSorter } from '@nearform/observer-sdk'

import {
  // AgeContent,
  BytesContent,
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

/* TODO: fix stream age in mock data
const ageCol = {
  name: 'age',
  header: 'Time open',
  getProps: (stream, state, metadata) => {
    const age = getStreamAge(stream, state)
    console.log(age, metadata.maxAge)
    return {
      value: age,
      maxValue: metadata.maxAge,
    }
  },
  renderContent: AgeContent,
  sort: numericSorter,
}
*/

const protocolCol = {
  name: 'protocol',
  getProps: stream => ({ value: stream.getProtocol() }),
  sort: stringSorter,
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
const columns = [
  streamStatusCol,
  protocolCol,
  dataInCol,
  dataOutCol,
  //  ageCol,
]

export default columns
