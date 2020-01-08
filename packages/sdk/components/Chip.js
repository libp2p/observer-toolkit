import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import Icon from './Icon'

const Container = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing([0, 0.5])};
  background: ${({ theme, getColor }) => getColor(theme, 0.15)};
  color: ${({ theme, getColor }) => getColor(theme, 1)};
  white-space: nowrap;
  font-size: 8pt;
  font-weight: 600;
`

const ChipText = styled.span`
  line-height: 2em;
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(0.5, 0)};
  vertical-align: middle;
`

function Chip({ type, options, prefix = '', suffix = '', children, ...props }) {
  if (!options[type]) {
    throw new Error(
      `Chip option "${type}" not in "${Object.keys(options).join('", "')}"`
    )
  }
  const { icon, colorKey, colorIndex } = options[type]

  const getColor = (theme, opacity) =>
    theme.color(colorKey, colorIndex || 0, opacity)

  return (
    <Container getColor={getColor} {...props}>
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
  children: T.node,
}

export default Chip
