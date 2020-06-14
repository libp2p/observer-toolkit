import React from 'react'
import T from 'prop-types'
import { withTheme } from 'styled-components'

import Chip from './Chip'

function StaticChip({ type, options, children, glow, theme, ...props }) {
  if (!options[type]) {
    throw new Error(
      `Chip option "${type}" not in "${Object.keys(options).join('", "')}"`
    )
  }
  const { icon, colorKey, colorIndex } = options[type]

  const getColor = (theme, opacity) =>
    theme.color(colorKey, colorIndex || 0, opacity)

  const color = getColor(theme, 1)
  const backgroundColor = getColor(theme, 0.15)
  const glowColor = glow ? getColor(theme, glow) : ''

  return (
    <Chip
      color={color}
      backgroundColor={backgroundColor}
      glowColor={glowColor}
      icon={icon}
      {...props}
    >
      {children}
    </Chip>
  )
}

StaticChip.propTypes = {
  type: T.string.isRequired,
  options: T.object.isRequired,
  theme: T.object.isRequired,
  glow: T.number,
  children: T.node,
}

export default withTheme(StaticChip)
