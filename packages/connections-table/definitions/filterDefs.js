import {
  getListFilter,
  getRangeFilter,
  useCalculation,
} from '@libp2p-observer/sdk'
import { getConnections, getStreams, statusNames } from '@libp2p-observer/data'

const statusNamesList = Object.values(statusNames)

function getMaxStreams() {
  const maxStreams = useCalculation(
    ({ timepoint }) =>
      getConnections(timepoint).reduce(
        (max, conn) => Math.max(max, getStreams(conn).length),
        0
      ),
    ['timepoint']
  )
  return maxStreams
}

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
    max: getMaxStreams,
  }),
]

export default filterDefs
