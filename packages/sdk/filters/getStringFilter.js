import StringMatch from '../components/input/fields/StringMatch'

const defaultFilter = (targetValue, values) => {
  const matcher = values.regexp ? getRegExp(values.string) : values.string

  if (matcher instanceof Error) return true

  const match =
    matcher instanceof RegExp
      ? targetValue.match(matcher)
      : targetValue.includes(matcher)
  return values.exclude !== !!match
}
const DefaultUi = StringMatch

const initialValues = {
  regexp: false,
  exclude: false,
  string: '',
}

const valueNames = Object.keys(initialValues)

function getStringFilter({
  name = 'Filter by text',
  doFilter = defaultFilter,
  FilterUi = DefaultUi,
  mapFilter,
  ...inputProps
}) {
  return {
    name,
    doFilter,
    FilterUi,
    initialValues,
    valueNames,
    mapFilter,
    filterUiProps: {
      ...inputProps,
    },
  }
}

function getRegExp(str) {
  try {
    const regexp = new RegExp(str)
    return regexp
  } catch (err) {
    return err
  }
}

export default getStringFilter
