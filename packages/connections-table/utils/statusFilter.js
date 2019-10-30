import { CheckboxList, doFilterToWhitelist } from 'sdk'
import { statusNames } from 'proto'

const statusKeys = Object.values(statusNames)

const name = 'statusFilter'
const doFilter = doFilterToWhitelist
const FilterUi = CheckboxList
const initialValues = statusKeys.reduce((values, key) => {
  values[key] = true
  return values
}, {})
const filterUiProps = {
  fieldNames: statusKeys,
  title: 'Filter by status:',
}

export { name, doFilter, FilterUi, filterUiProps, initialValues }
