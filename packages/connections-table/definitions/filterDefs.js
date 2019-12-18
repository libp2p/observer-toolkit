import { getListFilter, getRangeFilter } from '@libp2p-observer/sdk'
import { getStreams, statusNames } from '@libp2p-observer/data'

const statusNamesList = Object.values(statusNames)

const filterDefs = [
  getListFilter({
    name: 'Filter by status',
    mapFilter: conn => statusNamesList[conn.getStatus()],
    valueNames: statusNamesList,
  }),
  getRangeFilter({
    name: 'Filter number of streams',
    mapFilter: conn => getStreams(conn).length,
    min: 0,
  }),
]

export default filterDefs
