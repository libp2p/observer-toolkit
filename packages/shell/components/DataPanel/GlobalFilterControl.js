import React, { useContext, useState } from 'react'
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

  console.log(globalFilters, dispatchGlobalFilters)

  return (
    <Container>
      {globalFilters.map(filter => (
        <FilterChip
          filter={filter}
          key={filter.name}
          dispatchFilters={dispatchGlobalFilters}
        />
      ))}
    </Container>
  )
}

export default GlobalFilterControl
