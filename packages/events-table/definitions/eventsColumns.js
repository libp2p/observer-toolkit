import {
  getStringSorter,
  getNumericSorter,
  DurationContent,
  MonospaceContent,
  TimeContent,
} from '@libp2p/observer-sdk'
import { getEventType } from '@libp2p/observer-data'

import { ShowJsonButton } from '../components/cellContent'

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
    return { value: event.getTs(), includeMs: true }
  },
  renderContent: TimeContent,
  sort: numericSorter,
  align: 'right',
}

const elapsedCol = {
  name: 'elapsed',
  header: 'Time since event',
  getProps: (event, { currentState, config }) => ({
    value: currentState.getInstantTs() - event.getTs(),
    maxValue: config.getRetentionPeriodMs(),
  }),
  renderContent: DurationContent,
  sort: numericSorter,
  align: 'right',
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
const columns = [timeCol, elapsedCol, typeCol, jsonCol]

export default columns
