import { useState } from 'react'
import T from 'prop-types'

function getNumericSorter(direction) {
  const numericSorter = (a, b) => (direction === 'asc' ? a - b : b - a)
  return numericSorter
}

function getStringSorter(direction) {
  const caselessSorter = Intl.Collator('en').compare
  const stringSorter = (a, b) => {
    const sortNum = caselessSorter(a, b)
    return direction === 'asc' ? sortNum : sortNum * -1
  }
  return stringSorter
}

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

const defaultOptions = [['asc', 'ascending'], ['desc', 'descending']]

function useSorter({
  getSorter,
  mapSorter,
  defaultDirection,
  directionOptions = defaultOptions,
  disabled = false,
}) {
  const [sortDirection, setSortDirection] = useState(defaultDirection || null)

  if (disabled) return { sorter: () => 0, sortDirection, setSortDirection }

  validateDirection(sortDirection, directionOptions)
  const sorter = makeSorter(sortDirection, getSorter, mapSorter)

  return {
    sorter,
    sortDirection,
    setSortDirection,
  }
}

useSorter.propTypes = {
  data: T.array.isRequired,
  getSorter: T.func,
  mapSorter: T.func,
  defaultDirection: T.string,
  directionOptions: T.arrayOf([
    T.arrayOf([
      T.string, // direction name
      T.string, // user-facing direction label
      T.node, // icon
    ]),
  ]),
  disabled: T.bool,
}

export default useSorter

export { getNumericSorter, getStringSorter }
