import { useCallback, useReducer, useRef } from 'react'
import T from 'prop-types'
import isEqual from 'lodash.isequal'

function updateFilters(filters, { action, name, values }) {
  if (!name && action !== 'update') {
    // Enable, disable or reset all filters
    filters.forEach(filter => updateFilters({ action, name: filter.name }))
  }

  const targetFilter = filters.find(filter => filter.name === name)
  if (!targetFilter) {
    throw new Error(
      `No filter named "${name}", only "${filters
        .map(filter => filter.name)
        .join('", "')}"`
    )
  }

  switch (action) {
    case 'update':
      return updateValues(filters, targetFilter, values)
    case 'enable':
      return enableFilter(filters, targetFilter)
    case 'disable':
      return disableFilter(filters, targetFilter)
    case 'reset':
      return resetFilter(filters, targetFilter)
    default:
      throw new Error(`Unrecognised action "${action}" for updateFilters`)
  }
}

function updateValues(filters, targetFilter, values) {
  if (targetFilter.values === values) return filters
  const { initialValues } = targetFilter.getFilterDef()

  if (!targetFilter.enabled && isEqual(targetFilter.values, initialValues)) {
    targetFilter.enabled = true
  }

  if (targetFilter.enabled && isEqual(values, initialValues)) {
    targetFilter.enabled = false
  }

  targetFilter.values = values
  return [...filters]
}

function enableFilter(filters, targetFilter) {
  if (targetFilter.enabled) return filters

  targetFilter.enabled = true
  return [...filters]
}

function disableFilter(filters, targetFilter) {
  if (!targetFilter.enabled) return filters

  targetFilter.enabled = false
  return [...filters]
}

function resetFilter(filters, targetFilter) {
  const { initialValues } = targetFilter.getFilterDef()

  if (!targetFilter.enabled && isEqual(targetFilter.values, initialValues))
    return filters

  targetFilter.values = initialValues
  targetFilter.enabled = false

  return [...filters]
}

function initializeFilters(filterDefsRef) {
  return filterDefsRef.current.map(({ initialValues, name }) => ({
    values: { ...initialValues },
    name,
    enabled: false,
    getFilterDef: () => filterDefsRef.current.find(def => def.name === name),
  }))
}

function useFilter(filterDefs) {
  const filterDefsRef = useRef()
  filterDefsRef.current = filterDefs

  const [filters, dispatchFilters] = useReducer(
    updateFilters,
    initializeFilters(filterDefsRef)
  )

  // Separate filter definitions and state
  // values and enabled in filters
  // defs pass straight through

  const applyFilters = useCallback(
    datum => {
      if (!filters.length) return true
      return filters
        .filter(filter => filter.enabled)
        .every(({ name, values, getFilterDef }) => {
          const { doFilter, mapFilter } = getFilterDef()
          return (
            !values || doFilter(mapFilter ? mapFilter(datum) : datum, values)
          )
        })
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
  ),
  mapFilter: T.func,
}

export default useFilter
