import React, { useContext } from 'react'
import styled from 'styled-components'

import {
  FilterChip,
  GlobalFilterContext,
  SetterContext,
} from '@libp2p-observer/sdk'

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing()};
`

function GlobalFilterControl() {
  const globalFilters = useContext(GlobalFilterContext)
  const { dispatchGlobalFilters } = useContext(SetterContext)

  return (
    <Container>
      {globalFilters.map(filter => (
        <FilterChip
          filter={filter}
          key={filter.name}
          dispatchFilters={dispatchGlobalFilters}
          isOpen={globalFilters.length === 1}
          side="top"
        />
      ))}
    </Container>
  )
}

export default GlobalFilterControl
