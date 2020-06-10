import { getStringSorter, getNumericSorter } from '@nearform/observer-sdk'
import { getEventType } from '@nearform/observer-data'

import { RenderTime } from '../components/contentRenderers'

import { MonospaceContent, ShowJsonButton } from '../components/cellContent'

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
    return { value: event.getTs() }
  },
  renderContent: RenderTime,
  sort: numericSorter,
  align: 'right',
  cellProps: {
    width: '10%',
  },
}

const typeCol = {
  name: 'type',
  getProps: event => ({ value: getEventType(event) }),
  sort: stringSorter,
  renderContent: MonospaceContent,
  cellProps: {
    width: '12%',
  },
}

const jsonCol = {
  name: 'json',
  header: 'Raw JSON',
  getProps: (event, { hidePrevious }) => ({
    value: event.getContent(),
    hidePrevious,
  }),
  renderContent: ShowJsonButton,
  cellProps: {
    width: '16%',
  },
}

// Define column order
const columns = [timeCol, typeCol, jsonCol]

export default columns
