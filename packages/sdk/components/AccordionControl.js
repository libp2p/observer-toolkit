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

const VerticalIcon = styled.span`
  ${colorTransition}
  transform: rotate(0deg);
  ${({ active }) =>
    active &&
    css`
      transform: rotate(180deg);
    `}
`

const HorizontalIcon = styled(VerticalIcon)`
  transform: rotate(-90deg);
  ${({ active }) =>
    active &&
    css`
      transform: rotate(90deg);
    `}
`

function AccordionControl({
  isOpen,
  setIsOpen,
  children,
  direction = 'vertical',
  override = {},
  ...props
}) {
  const toggleOpen = () => setIsOpen(!isOpen)

  const IconContainer = direction === 'vertical' ? VerticalIcon : HorizontalIcon
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
        override={{ Container: IconContainer }}
      />
    </AccordionButton>
  )
}

AccordionControl.propTypes = {
  isOpen: T.bool.isRequired,
  setIsOpen: T.func.isRequired,
  direction: T.string,
  children: T.node.isRequired,
  override: T.object,
}

export default AccordionControl
