import { getStringSorter, getNumericSorter } from '@libp2p-observer/sdk'

import {
  TimeContent,
  EventContent,
  RawJsonContent,
} from '../components/cellContent'

const stringSorter = {
  getSorter: getStringSorter,
  defaultDirection: 'asc',
}

const numericSorter = {
  getSorter: getNumericSorter,
  defaultDirection: 'desc',
}

const timeCol = {
  name: 'time',
  getProps: event => {
    return { value: event.getTs().getSeconds() }
  },
  renderContent: TimeContent,
  sort: numericSorter,
  align: 'right',
  cellProps: {
    width: '11%',
  },
}

const typeCol = {
  name: 'type',
  getProps: event => ({ value: event.getType() }),
  sort: stringSorter,
  cellProps: {
    width: '11%',
  },
}

const contentCol = {
  name: 'content',
  getProps: event => ({
    value: event.getContent(),
    type: event.getType(),
    key: JSON.stringify({
      time: event.getTs().getSeconds(),
      type: event.getType(),
      content: event.getContent(),
    }),
  }),
  cellProps: {
    padding: 0,
    width: '56%',
  },
  renderContent: EventContent,
  rowKey: 'key',
}

const jsonCol = {
  name: 'json',
  header: 'Raw JSON',
  getProps: event => ({
    value: event.getContent(),
  }),
  renderContent: RawJsonContent,
  cellProps: {
    width: '22%',
  },
}

// Define column order
const columns = [timeCol, typeCol, contentCol, jsonCol]

export default columns
