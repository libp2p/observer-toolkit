import { getListFilter } from '@nearform/observer-sdk'
import { statusNames } from '@nearform/observer-data'

const statusNamesList = Object.values(statusNames)

const statusFilter = getListFilter({
  name: 'Filter by status',
  options: statusNamesList,
})

export default statusFilter
