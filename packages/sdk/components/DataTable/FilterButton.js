import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import Icon from '../Icon'

const Container = styled.span`
  display: inline-block;
  position: relative;
`

const AccordionContent = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  right: -${({ theme }) => theme.spacing()};
  padding: ${({ theme }) => theme.spacing()};
  background: ${({ theme }) => theme.color('light', 'mid', 0.8)};
`

function FilterButton({ updateValues, FilterUi }) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <Container>
      <Icon type="filter" onClick={toggleOpen} offset />
      <AccordionContent isOpen={isOpen}>
        <FilterUi onChange={updateValues} />
      </AccordionContent>
    </Container>
  )
}

FilterButton.propTypes = {
  updateValues: T.func.isRequired,
  FilterUi: T.elementType.isRequired,
}

export default FilterButton
