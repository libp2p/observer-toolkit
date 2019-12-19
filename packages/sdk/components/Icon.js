import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import icons from '../theme/icons'

const Container = styled.span`
  user-select: none; /* Stops nearby text being selected if icon clicked quickly */
  display: inline-block;
  vertical-align: middle;
  width: ${({ size }) => size};
  height: ${({ size }) => size};

  ${({ theme, active }) => active && `color: ${theme.color('highlight')};`}

  ${({ theme, disabled }) =>
    disabled &&
    `
      color: ${theme.color('text', 3)};
  `}
  ${({ onClick, theme, disabled }) =>
    onClick &&
    !disabled &&
    `
    cursor: pointer;
    &:hover {
      backgroundColor: ${theme.color('background', 1, 0.3)};
    }
  `}
`

const Empty = styled.span`
  display: inline-block;
`

function Icon({
  type,
  onClick,
  active,
  disabled,
  size = '2em',
  override = {},
  ...props
}) {
  const IconSvg = type ? icons[type] : Empty
  if (!IconSvg) throw new Error(`No icon found named "${type}"`)

  return (
    <Container
      onClick={disabled ? null : onClick}
      active={active}
      disabled={disabled}
      size={size}
      as={override.Container}
      {...props}
    >
      <IconSvg as={override.IconSvg} />
    </Container>
  )
}

Icon.propTypes = {
  type: T.string,
  onClick: T.func,
  active: T.bool,
  disabled: T.bool,
  size: T.string,
  override: T.object,
}

export default Icon
