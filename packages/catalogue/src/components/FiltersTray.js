import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { FilterChip, FilterContext } from '@libp2p-observer/sdk'

const Container = styled.div`
  display: flex;
`

function FiltersTray({ isOpen = false, overrides = {} }) {
  const { filters } = useContext(FilterContext)

  return (
    <Container isOpen={isOpen}>
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
