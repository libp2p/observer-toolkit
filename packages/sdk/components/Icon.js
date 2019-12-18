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
  ${({ theme, offset }) => offset && `margin-right: -${theme.spacing(2)};`}
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

function Icon({
  type,
  onClick,
  active,
  disabled,
  size = '2em',
  override = {},
}) {
  const IconSvg = icons[type]
  if (!IconSvg) throw new Error(`No icon found named "${type}"`)

  const isButton = onClick && !disabled

  return (
    <Container
      role={isButton ? 'button' : 'img'}
      onClick={isButton ? onClick : null}
      active={active}
      disabled={disabled}
      size={size}
      as={override.Container}
    >
      <IconSvg as={override.IconSvg} />
    </Container>
  )
}

Icon.propTypes = {
  type: T.string.isRequired,
  onClick: T.func,
  active: T.bool,
  disabled: T.bool,
  offset: T.bool,
  size: T.number,
  override: T.object,
}

export default Icon
