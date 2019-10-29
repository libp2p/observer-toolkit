import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import icons from '../theme/icons'

const Container = styled.span`
  display: inline-block;
  vertical-align: middle;
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  ${({ theme, active }) =>
    active && `color: ${theme.color('tertiary', 'mid')}`};
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

function Icon({ type, onClick, active }) {
  const IconSvg = icons[type]

  return (
    <Container onClick={onClick} active={active}>
      <IconSvg />
    </Container>
  )
}

Icon.propTypes = {
  type: T.string.isRequired,
  onClick: T.func,
  active: T.bool,
  offset: T.bool,
}

export default Icon
