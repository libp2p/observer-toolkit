import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import icons from '../theme/icons'

function Icon({ type, onClick, active }) {
  const StyledIcon = styled.img.attrs(() => ({
    src: `${icons[type]}`,
    onClick: onClick,
  }))`
    width: ${({ theme }) => theme.spacing(3)};
    height: ${({ theme }) => theme.spacing(3)};
    // TODO: modify SVG to use currentColor
    color: ${({ theme }) => theme.color(active ? 'secondary' : 'light', 'mid')};
    object-fit: cover;
    display: inline-block;
    vertical-align: middle;
    ${({ theme, offset }) => offset && `margin-right: -${theme.spacing(2)};`}
    ${onClick &&
      `
      cursor: pointer;
      &:hover {
        backgroundColor: ${({ theme }) => theme.color('light', 'mid')};
      }
    `}
  `
  return <StyledIcon />
}

Icon.propTypes = {
  type: T.string.isRequired,
  onClick: T.func,
  active: T.bool,
  offset: T.bool,
}

export default Icon
