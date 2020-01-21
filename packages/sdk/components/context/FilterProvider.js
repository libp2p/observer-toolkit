import React, { createContext } from 'react'
import T from 'prop-types'

import useFilter from '../../hooks/useFilter'

const FilterContext = createContext()
const FilterSetterContext = createContext()

function FilterProvider({ filterDefs = [], children }) {
  const { applyFilters, dispatchFilters, filters } = useFilter(filterDefs)

  return (
    // applyFilters and filters change together; dispatchFilters should never change
    <FilterSetterContext.Provider value={dispatchFilters}>
      <FilterContext.Provider value={{ applyFilters, filters, filterDefs }}>
        {children}
      </FilterContext.Provider>
    </FilterSetterContext.Provider>
  )
}

FilterProvider.propTypes = {
  filterDefs: T.array,
  children: T.node.isRequired,
}

export { FilterProvider, FilterContext, FilterSetterContext }
