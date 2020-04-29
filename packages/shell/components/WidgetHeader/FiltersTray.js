import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  FilterChip,
  FilterContext,
  FilterSetterContext,
} from '@libp2p-observer/sdk'

const Container = styled.div`
  display: flex;
`

function FiltersTray({ overrides = {} }) {
  const { filters } = useContext(FilterContext)
  const dispatchFilters = useContext(FilterSetterContext)

  return (
    <Container>
      {filters.map(filter => (
        <FilterChip
          filter={filter}
          key={filter.name}
          dispatchFilters={dispatchFilters}
        />
      ))}
    </Container>
  )
}

FiltersTray.propTypes = {
  isOpen: T.bool,
  overrides: T.object,
}

export default FiltersTray
