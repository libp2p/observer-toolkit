import { useState } from 'react'
import T from 'prop-types'

function validateDirection(sortDirection, directionOptions) {
  // null disables sorter
  if (!sortDirection) return

  const directionOptionKeys = directionOptions.map(option => option[0])

  if (!directionOptionKeys.includes(sortDirection)) {
    throw new Error(
      `Sort direction ${sortDirection} not one of "${directionOptionKeys.join(
        '", "'
      )}"`
    )
  }
}

function makeSorter(sortDirection, getSorter, mapSorter) {
  if (!sortDirection) return () => {}
  if (!mapSorter) return getSorter(sortDirection)
  const sorter = getSorter(sortDirection)
  return (a, b) => sorter(mapSorter(a), mapSorter(b))
}

function noopSorter() {
  return 0
}

const defaultOptions = [
  ['asc', 'ascending'],
  ['desc', 'descending'],
]

function useSorter(props) {
  T.checkPropTypes(useSorter.propTypes, props, 'prop', 'useSorter')
  const {
    getSorter,
    mapSorter,
    defaultDirection,
    directionOptions = defaultOptions,
    disabled = false,
  } = props

  const [sortDirection, setSortDirection] = useState(defaultDirection || null)

  if (disabled || !getSorter)
    return { noopSorter, sortDirection, setSortDirection }

  validateDirection(sortDirection, directionOptions)
  const sorter = makeSorter(sortDirection, getSorter, mapSorter)

  return {
    sorter,
    sortDirection,
    setSortDirection,
  }
}

useSorter.propTypes = {
  getSorter: T.func,
  mapSorter: T.func,
  defaultDirection: T.string,
  directionOptions: T.array,
  disabled: T.bool,
}

export default useSorter
