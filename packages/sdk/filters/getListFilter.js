import CheckboxList from '../components/input/fields/CheckboxList'

const DefaultUi = CheckboxList

function getListFilter({
  valueNames,
  defaultValue = true,
  name = 'Filter from list',
  doFilter,
  FilterUi = DefaultUi,
  includeMissingValues = true,
  mapFilter,
}) {
  if (!valueNames || !Array.isArray(valueNames))
    throw new Error(
      `listFilter requires an array of value names, got ${typeof valueNames}`
    )

  const defaultFilter = (targetValue, values) => {
    if (targetValue === null || targetValue === undefined)
      return includeMissingValues
    return !!values[targetValue]
  }

  const initialValues = valueNames.reduce((values, name) => {
    values[name] = defaultValue
    return values
  }, {})

  return {
    name,
    doFilter: doFilter || defaultFilter,
    FilterUi,
    initialValues,
    valueNames,
    mapFilter,
  }
}

export default getListFilter
