import { getStringSorter, getNumericSorter } from '@libp2p-observer/sdk'

import { RenderTime } from '../components/contentRenderers'

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
  renderContent: RenderTime,
  sort: numericSorter,
  align: 'right',
}

const typeCol = {
  name: 'type',
  getProps: event => ({ value: event.getType() }),
  sort: stringSorter,
}

// Define column order
const columns = [timeCol, typeCol]

export default columns
