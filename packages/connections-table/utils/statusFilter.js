import { getListFilter } from '@libp2p-observer/sdk'
import { statusNames } from '@libp2p-observer/data'

const statusNamesList = Object.values(statusNames)

const statusFilter = getListFilter({
  name: 'Filter by status',
  options: statusNamesList,
})

export default statusFilter
