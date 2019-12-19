import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { FilterChip, FilterContext } from '@libp2p-observer/sdk'

const Container = styled.div`
  display: flex;
`

function FiltersTray({ overrides = {} }) {
  const { filters } = useContext(FilterContext)

  return (
    <Container>
      {filters.map(filter => (
        <FilterChip filterDef={filter} key={filter.name} />
      ))}
    </Container>
  )
}

FiltersTray.propTypes = {
  isOpen: T.bool,
  overrides: T.object,
}

export default FiltersTray
