import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import isEqual from 'lodash.isequal'

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
  z-index: 20;
`

function FilterButton({ updateValues, initialValues, FilterUi, values }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleChange = newValues => {
    if (updateValues) updateValues(newValues)
    setIsActive(!isEqual(newValues, initialValues))
  }

  return (
    <Container>
      <Icon type="filter" onClick={toggleOpen} offset active={isActive} />
      <AccordionContent isOpen={isOpen}>
        <FilterUi onChange={handleChange} />
      </AccordionContent>
    </Container>
  )
}

FilterButton.propTypes = {
  updateValues: T.func.isRequired,
  FilterUi: T.elementType.isRequired,
  initialValues: T.any,
}

export default FilterButton
