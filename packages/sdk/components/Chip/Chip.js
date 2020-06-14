import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import Icon from '../Icon'
import Tooltip from '../Tooltip'

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

const SvgImage = styled.span.attrs(({ svgB64 }) => ({
  style: {
    backgroundImage: `url('data:image/svg+xml;base64,${svgB64}')`,
  },
}))`
  display: inline-block;
  height: ${({ size }) => (size ? `${size}px` : 'inherit')};
  width: ${({ size }) => (size ? `${size}px` : 'inherit')};
  color: currentColor;
  vertical-align: middle;
`

function Chip({
  color,
  backgroundColor,
  glowColor,
  icon,
  prefix = '',
  suffix = '',
  svgB64,
  iconSize,
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
      {svgB64 && (
        <Tooltip content={'Generated icon'} side="left">
          <SvgImage svgB64={svgB64} size={iconSize} />
        </Tooltip>
      )}
      {icon && <Icon type={icon} size={iconSize} />}
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
  svgB64: T.string,
  iconSize: T.number,
  fade: T.number,
  children: T.node,
}

export default Chip
