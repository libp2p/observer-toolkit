import Slider from '../components/input/fields/Slider'

const defaultFilter = (targetValue, values) => {
  // If a value is null, that end of the range is unset, so allow all
  if (typeof values['min'] === 'number' && targetValue < values['min'])
    return false
  if (typeof values['max'] === 'number' && targetValue > values['max'])
    return false
  return true
}
const DefaultUi = Slider

function getRangeFilter({
  steps,
  stepInterval,
  min = 0,
  max = 0,
  name = 'Filter by range',
  doFilter = defaultFilter,
  FilterUi = DefaultUi,
  mapFilter,
}) {
  // Use empty strings for null values so form elements don't become uncontrolled
  const initialValues = {
    min: '',
    max: '',
  }

  const valueNames = ['min', 'max']

  return {
    name,
    doFilter,
    FilterUi,
    initialValues,
    valueNames,
    mapFilter,
    filterUiProps: {
      min,
      max,
      steps,
      stepInterval,
    },
  }
}

export default getRangeFilter
