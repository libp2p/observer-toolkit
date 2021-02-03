import {
  getStringSorter,
  getNumericSorter,
  PeerIdContent,
  TimeContent,
} from '@libp2p/observer-sdk'

import LookupQueriesContent from '../components/QueriesSubtable/LookupQueriesContent'

const stringSorter = {
  getSorter: getStringSorter,
  defaultDirection: 'asc',
}

const numericSorter = {
  getSorter: getNumericSorter,
  defaultDirection: 'desc',
}

const targetCol = {
  name: 'target',
  header: 'Target Key',
  getProps: lookup => ({
    value: lookup.getTarget(),
    rowKey: `${lookup.getTarget()}_${lookup.getStartTs()}`,
  }),
  renderContent: PeerIdContent, // Is it?
  sort: stringSorter,
  rowKey: 'rowKey',
}

const startCol = {
  name: 'open',
  header: 'Time started',
  getProps: lookup => {
    const openTs = lookup.getStartTs()
    return { value: openTs }
  },
  renderContent: TimeContent,
  sort: numericSorter,
  align: 'right',
}

const endCol = {
  name: 'closed',
  header: 'Time ended',
  getProps: lookup => {
    const closeTs = lookup.getEndTs()
    return { value: closeTs }
  },
  renderContent: TimeContent,
  sort: numericSorter,
  align: 'right',
}

const queriesCol = {
  name: 'queries',
  header: 'Queries',
  getProps: lookup => ({
    value: lookup.getQueriesList().length,
    lookup,
  }),
  sort: numericSorter,
  renderContent: LookupQueriesContent,
  cellProps: {
    style: { padding: '0 8px 0 0' },
  },
  align: 'right',
}

// Define column order

const columns = [targetCol, startCol, endCol, queriesCol]

export default columns
