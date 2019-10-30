import CheckboxList from '../components/input/fields/CheckboxList'

const defaultFilter = (targetValue, values) => {
  return !!values[targetValue]
}
const DefaultUi = CheckboxList

function getListFilter({
  options,
  defaultValue = true,
  name = 'Filter from list',
  doFilter = defaultFilter,
  FilterUi = DefaultUi,
}) {
  if (!options || !Array.isArray(options))
    throw new Error(
      `listFilter requires an array of options, got ${typeof options}`
    )

  const initialFieldValues = new Map(
    options.map(option => [option, defaultValue])
  )

  return {
    name,
    doFilter,
    FilterUi,
    initialFieldValues,
  }
}

export default getListFilter
