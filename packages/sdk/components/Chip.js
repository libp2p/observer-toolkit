import React from 'react'
import T from 'prop-types'
import styled, { css } from 'styled-components'

import Icon from './Icon'

const Container = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing([0, 0.5])};
  background: ${({ theme, getColor }) => getColor(theme, 0.15)};
  color: ${({ theme, getColor }) => getColor(theme, 1)};
  white-space: nowrap;
  font-size: 8pt;
  font-weight: 600;
  ${({ fade }) =>
    !fade
      ? ''
      : css`
          opacity: ${fade};
        `}
  ${({ theme, getColor, glow }) =>
    !glow
      ? ''
      : css`
          box-shadow: 0 0 ${theme.spacing()} 0 ${getColor(theme, glow)};
        `};
`

const ChipText = styled.span`
  line-height: 2em;
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(0.5, 0)};
  vertical-align: middle;
`

function Chip({
  type,
  options,
  prefix = '',
  suffix = '',
  fade,
  glow,
  children,
  ...props
}) {
  if (!options[type]) {
    throw new Error(
      `Chip option "${type}" not in "${Object.keys(options).join('", "')}"`
    )
  }
  const { icon, colorKey, colorIndex } = options[type]

  const getColor = (theme, opacity) =>
    theme.color(colorKey, colorIndex || 0, opacity)

  return (
    <Container getColor={getColor} fade={fade} glow={glow} {...props}>
      {prefix}
      {icon && <Icon type={icon} />}
      <ChipText>{children || type}</ChipText>
      {suffix}
    </Container>
  )
}

Chip.propTypes = {
  type: T.string.isRequired,
  options: T.object.isRequired,
  prefix: T.node,
  suffix: T.node,
  fade: T.number,
  glow: T.number,
  children: T.node,
}

export default Chip
