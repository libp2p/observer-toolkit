import CheckboxList from '../components/input/fields/CheckboxList'

const defaultFilter = (targetValue, values) => {
  return !!values[targetValue]
}
const DefaultUi = CheckboxList

function getListFilter({
  valueNames,
  defaultValue = true,
  name = 'Filter from list',
  doFilter = defaultFilter,
  FilterUi = DefaultUi,
  mapFilter,
}) {
  if (!valueNames || !Array.isArray(valueNames))
    throw new Error(
      `listFilter requires an array of value names, got ${typeof valueNames}`
    )

  const initialValues = valueNames.reduce((values, name) => {
    values[name] = defaultValue
    return values
  }, {})

  return {
    name,
    doFilter,
    FilterUi,
    initialValues,
    valueNames,
    mapFilter,
  }
}

export default getListFilter
