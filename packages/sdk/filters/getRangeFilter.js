import Slider from '../components/input/fields/Slider'

const defaultFilter = (targetValue, values) => {
  return targetValue >= values['min'] && targetValue <= values['max']
}
const DefaultUi = Slider

function getRangeFilter({
  steps,
  min = 0,
  max = 0,
  name = 'Filter by range',
  doFilter = defaultFilter,
  FilterUi = DefaultUi,
}) {
  const initialFieldValues = new Map([['min', min], ['max', max]])

  return {
    name,
    doFilter,
    FilterUi,
    initialFieldValues,
    filterUiProps: {
      min,
      max,
      steps,
    },
  }
}

export default getRangeFilter
