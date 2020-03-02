import { getStringSorter, getNumericSorter } from '@libp2p-observer/sdk'

import { TimeContent, EventContent } from '../components/cellContent'

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
    width: '15%',
  },
}

const typeCol = {
  name: 'type',
  getProps: event => ({ value: event.getType() }),
  sort: stringSorter,
  cellProps: {
    width: '15%',
  },
}

const contentCol = {
  name: 'content',
  getProps: event => ({
    value: event.getContentMap().getEntryList(),
    type: event.getType(),
    key: JSON.stringify({
      time: event.getTs().getSeconds(),
      type: event.getType(),
      content: event.getContentMap().getEntryList(),
    }),
  }),
  cellProps: {
    padding: 0,
    width: '70%',
  },
  renderContent: EventContent,
  rowKey: 'key',
}

// Define column order
const columns = [timeCol, typeCol, contentCol]

export default columns
