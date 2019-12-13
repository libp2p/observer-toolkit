import React from 'react'
import T from 'prop-types'
import styled, { css } from 'styled-components'

import Icon from '../components/Icon'
import StyledButton from '../components/input/StyledButton'

const AccordionButton = styled(StyledButton)`
  border: none;
  color: ${({ theme }) => theme.color('text', 2)};
  margin: ${({ theme }) => theme.spacing([0, 2])};
`

const AccordionIcon = styled.span`
  transition: all 0.4s ease-in-out;
  transform: rotate(0deg);
  ${({ active }) =>
    active &&
    css`
      transform: rotate(180deg);
    `}
`

function AccordionControl({ isOpen, setIsOpen, children, overrides = {} }) {
  const toggleOpen = () => setIsOpen(!isOpen)
  return (
    <AccordionButton onClick={toggleOpen} as={overrides.AccordionButton}>
      {children}
      <Icon
        type={'expand'}
        active={isOpen}
        override={{ Container: AccordionIcon }}
      />
    </AccordionButton>
  )
}

AccordionControl.propTypes = {
  control: T.node.isRequired,
  content: T.node.isRequired,
  defaultIsOpen: T.bool,
  overrides: T.object,
}

export default AccordionControl
