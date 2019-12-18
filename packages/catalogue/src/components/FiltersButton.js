import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { AccordionControl, FilterContext, Icon } from '@libp2p-observer/sdk'

const nbsp = '\u00a0'

const AccordionButton = styled.button`
  color: ${({ theme, isActive }) =>
    isActive ? theme.color('highlight') : theme.color('text', 2)};
  border: 1px solid currentColor;
  background: none;
`

function FiltersButton({ setIsOpen, isOpen = false }) {
  const { filters } = useContext(FilterContext)
  const enabledFilterCount = filters.filter(filter => filter.enabled).length

  const isActive = !!enabledFilterCount

  // Use &nbsp;s in singular case to reduce jarring change in text length
  const labelText = `${enabledFilterCount} active filter${
    enabledFilterCount === 1 ? nbsp + nbsp : 's'
  }`

  return (
    <AccordionControl
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      isActive={isActive}
      overrides={{ AccordionButton }}
    >
      <Icon type="filter" />
      {labelText}
    </AccordionControl>
  )
}

FiltersButton.propTypes = {
  setIsOpen: T.func.isRequired,
  isOpen: T.bool,
  overrides: T.object,
}

export default FiltersButton
