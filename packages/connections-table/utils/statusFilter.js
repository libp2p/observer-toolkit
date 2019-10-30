import { getListFilter } from 'sdk'
import { statusNames } from 'proto'

const statusNamesList = Object.values(statusNames)

const statusFilter = getListFilter({
  name: 'Filter by status',
  options: statusNamesList,
})

export default statusFilter
