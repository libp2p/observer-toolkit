import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import Icon from '../Icon'

const Container = styled.span.attrs(({ theme, glowColor, fade }) => ({
  style: {
    opacity: fade,
    boxShadow: glowColor ? `0 0 ${theme.spacing(2)} 0 ${glowColor}` : 'none',
  },
}))`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing([0, 0.5])};
  background: ${({ theme, backgroundColor }) => backgroundColor};
  color: ${({ theme, color }) => color};
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

function Chip({
  color,
  backgroundColor,
  glowColor,
  icon,
  prefix = '',
  suffix = '',
  fade,
  children,
  ...props
}) {
  return (
    <Container
      color={color}
      backgroundColor={backgroundColor}
      glowColor={glowColor}
      fade={fade}
      {...props}
    >
      {prefix}
      {icon && <Icon type={icon} />}
      <ChipText>{children}</ChipText>
      {suffix}
    </Container>
  )
}

Chip.propTypes = {
  color: T.string.isRequired,
  backgroundColor: T.string.isRequired,
  glowColor: T.string,
  icon: T.string,
  prefix: T.node,
  suffix: T.node,
  fade: T.number,
  children: T.node,
}

export default Chip
