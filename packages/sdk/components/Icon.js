import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import icons from '../theme/icons'

const Container = styled.span`
  display: inline-block;
  vertical-align: middle;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size}px;

  ${({ theme, active }) =>
    active
      ? `
      color: ${theme.color('tertiary', 'mid')};
      background: ${theme.color('light', 'light')};
    `
      : `
      background: ${theme.color('light', 'light', 0.5)};
    `};
  ${({ theme, offset }) => offset && `margin-right: -${theme.spacing(2)};`}
  ${({ onClick, theme }) =>
    onClick &&
    `
    cursor: pointer;
    &:hover {
      backgroundColor: ${theme.color('light', 'mid')};
    }
  `}
`

function Icon({ type, onClick, active, size = 20 }) {
  const IconSvg = icons[type]

  return (
    <Container onClick={onClick} active={active} size={size}>
      <IconSvg />
    </Container>
  )
}

Icon.propTypes = {
  type: T.string.isRequired,
  onClick: T.func,
  active: T.bool,
  offset: T.bool,
  size: T.number,
}

export default Icon
