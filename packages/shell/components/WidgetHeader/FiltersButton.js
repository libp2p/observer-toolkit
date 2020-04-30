import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { AccordionControl, FilterContext, Icon } from '@libp2p-observer/sdk'

const nbsp = '\u00a0'

const AccordionButton = styled.button`
  color: ${({ theme, isActive }) =>
    hasActiveFilters ? theme.color('highlight') : theme.color('text', 2)};
  border: 1px solid currentColor;
  background: none;
  margin: ${({ theme }) => theme.spacing([0, 4, 0, 1])};
`

const ButtonText = styled.span`
  padding: ${({ theme }) => theme.spacing([0, 0.5])};
`

function FiltersButton({ setIsOpen, isOpen = false }) {
  const { filters } = useContext(FilterContext)
  const enabledFilterCount = filters.filter(filter => filter.enabled).length

  const hasActiveFilters = !!enabledFilterCount

  // Use &nbsp;s in singular case to reduce jarring change in text length
  const labelText = `${enabledFilterCount} active filter${
    enabledFilterCount === 1 ? nbsp + nbsp : 's'
  }`

  return (
    <AccordionControl
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      hasActiveFilters={hasActiveFilters}
      data-highlighted={hasActiveFilters}
      overrides={{ AccordionButton }}
    >
      <Icon type="filter" />
      <ButtonText>{labelText}</ButtonText>
    </AccordionControl>
  )
}

FiltersButton.propTypes = {
  setIsOpen: T.func.isRequired,
  isOpen: T.bool,
  overrides: T.object,
}

export default FiltersButton
