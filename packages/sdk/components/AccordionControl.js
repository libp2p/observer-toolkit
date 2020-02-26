import React from 'react'
import T from 'prop-types'
import styled, { css } from 'styled-components'

import Icon from '../components/Icon'
import StyledButton from '../components/input/StyledButton'

const colorTransition = css`
  ${({ theme }) => theme.transition()}
  color: ${({ theme, active }) =>
    active ? theme.color('highlight', 0) : theme.color('text', 2)};
`

const AccordionButton = styled(StyledButton)`
  ${colorTransition}
  border: none;
  margin: ${({ theme }) => theme.spacing([0, 2])};
  ${({ theme }) => theme.transition()}
`

const AccordionIcon = styled.span`
  ${colorTransition}
  transform: rotate(0deg);
  ${({ active }) =>
    active &&
    css`
      transform: rotate(180deg);
    `}
`

function AccordionControl({
  isOpen,
  setIsOpen,
  children,
  override = {},
  ...props
}) {
  const toggleOpen = () => setIsOpen(!isOpen)
  return (
    <AccordionButton
      onClick={toggleOpen}
      active={isOpen}
      as={override.AccordionButton}
      {...props}
    >
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
  isOpen: T.bool.isRequired,
  setIsOpen: T.func.isRequired,
  children: T.node.isRequired,
  overrides: T.object,
}

export default AccordionControl
