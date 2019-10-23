import { useReducer, useCallback } from 'react'
import T from 'prop-types'

function doFilterToWhitelist(arrayItem, values) {
  if (!Array.isArray(values))
    throw new Error(
      `doFilterToWhitelist expects an array of values, got "${typeof values}"`
    )
  return values.includes(arrayItem)
}

function updateFilters(filters, { action, name, doFilter, values }) {
  switch (action) {
    case 'update':
      return updateValues(filters, name, values)
    case 'add':
      return addFilter(filters, { name, doFilter, values })
    case 'remove':
      return removeFilter(filters, name)
    default:
      throw new Error(`Unrecognised action "${action}" for updateFilters`)
  }
}

function updateValues(filters, name, values) {
  const existingFilter = filters.find(filter => filter.name === name)
  if (!existingFilter)
    throw new Error(
      `No filter named "${name}", only "${filters
        .map(filter => filter.name)
        .join('", "')}"`
    )
  existingFilter.values = values
  return filters
}

function addFilter(filters, newFilter) {
  filters.push(newFilter)
  return filters
}

function removeFilter(filters, existingFilter) {
  filters.splice(filters.indexOf(existingFilter), 1)
  return filters
}

function useFilter(initialFilters) {
  const [filters, dispatchFilters] = useReducer(updateFilters, initialFilters)

  const applyFilters = useCallback(
    datum => {
      if (!filters.length) return true
      return filters.every(({ doFilter, values, mapFilter = d => d }) =>
        doFilter(mapFilter(datum), values)
      )
    },
    [filters]
  )

  return { applyFilters, dispatchFilters, filters }
}

useFilter.propTypes = {
  initialFilters: T.arrayOf(
    T.shape({
      name: T.string.isRequired,
      doFilter: T.func.isRequired,
      initialValues: T.any,
      mapFilter: T.func,
    })
  ).isRequired,
  mapFilter: T.func,
}

export default useFilter
export { doFilterToWhitelist }
