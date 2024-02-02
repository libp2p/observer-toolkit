import {
  getStringSorter,
  getNumericSorter,
  PeerIdContent,
  TimeContent,
  MonospaceContent,
} from '@libp2p/observer-sdk'

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
  getProps: query => ({
    value: query.getTarget(),
    rowKey: `${query.getTarget()}_${query.getStartTs()}`,
  }),
  renderContent: PeerIdContent, // Is it?
  sort: stringSorter,
  rowKey: 'rowKey',
}

const startCol = {
  name: 'open',
  header: 'Time started',
  getProps: query => {
    const openTs = query.getStartTs()
    return { value: openTs }
  },
  renderContent: TimeContent,
  sort: numericSorter,
  align: 'right',
}

const endCol = {
  name: 'closed',
  header: 'Time ended',
  getProps: query => {
    const closeTs = query.getEndTs()
    return { value: closeTs }
  },
  renderContent: TimeContent,
  sort: numericSorter,
  align: 'right',
}

const StatusCol = {
  name: 'status',
  header: 'Status',
  getProps: query => {
    const status = query.getStatus()
    return { value: status }
  },
  renderContent: MonospaceContent,
  sort: stringSorter,
  align: 'right',
}

const distanceCol = {
  name: 'distance',
  header: 'Distance',
  getProps: query => {
    const distance = query.getDistance()
    return { value: distance }
  },
  renderContent: MonospaceContent,
  sort: numericSorter,
  align: 'right',
}

// TODO: Queries peers with tooltip

// Define column order

const columns = [targetCol, startCol, endCol, StatusCol, distanceCol]

export default columns
