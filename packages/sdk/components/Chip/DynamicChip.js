import React, { useMemo } from 'react'
import T from 'prop-types'
import { withTheme } from 'styled-components'
import ColorHash from 'color-hash'
const colorHash = new ColorHash()
import identicon from 'svg-identicon'

import { Chip } from '@libp2p/observer-sdk'

function getPercent(dec) {
  return `${dec * 100}%`
}

function getColorString([h, sDec, lDec], a) {
  const s = getPercent(sDec)
  const l = getPercent(lDec)
  return `hsla(${h}, ${s}, ${l}, ${a})`
}

function getHex(value) {
  let hex = ''
  for (let i = 0; i < value.length; i++) {
    hex += value.charCodeAt(i).toString(16)
  }
  return hex
}

function DynamicChip({
  value,
  splitter = '/',
  glow,
  iconSize,
  theme,
  ...props
}) {
  const { color, backgroundColor, glowColor, svgB64 } = useMemo(() => {
    let hsl
    let svgB64 = null
    const hex = getHex(value)

    const parts = value.split(splitter)
    if (parts.length > 1) {
      // Give values like 'something/1.2' and 'something/2.6/mod' the same hue but different saturations
      const end = parts.slice(1).join(splitter)
      hsl = colorHash.hsl(getHex(parts[0]))
      const [, saturation] = colorHash.hsl(getHex(end))
      hsl[1] = saturation
    } else {
      hsl = colorHash.hsl(hex)
    }

    const color = getColorString(hsl, 1)
    const backgroundColor = getColorString(hsl, 0.15)
    const glowColor = glow ? getColorString(hsl, glow) : ''

    if (iconSize) {
      const iconColor = getColorString(hsl, 0.4)
      const identiconProps = {
        type: 'POLYGONAL',
        segments: 6,
        size: 2,
        width: iconSize,
        hash: hex,
      }
      const shape = identicon(identiconProps).replace(
        /="#\w+"/g,
        `="${iconColor}"`
      )
      const shape2 = identicon({
        ...identiconProps,
        hash: hex
          .split('')
          .reverse()
          .join(''),
      }).replace(/="#\w+"/g, `="${theme.color('background')}"`)

      const svgTag = shape.match(/(<svg.*?\>)/)[1]
      const paths1 = shape.match(/.*\<svg.*?\>(.*)\<\/svg\>/)[1]
      const paths2 = shape2.match(/.*\<svg.*?\>(.*)\<\/svg\>/)[1]

      const svg = `${svgTag}${paths2}${paths1}</svg>`
      svgB64 = btoa(svg)
    }

    return {
      color,
      backgroundColor,
      glowColor,
      svgB64,
    }
  }, [glow, iconSize, splitter, value, theme])

  return (
    <Chip
      color={color}
      svgB64={svgB64}
      backgroundColor={backgroundColor}
      glowColor={glowColor}
      iconSize={iconSize}
    >
      {value}
    </Chip>
  )
}

DynamicChip.propTypes = {
  value: T.string.isRequired,
  splitter: T.string,
  glow: T.number,
  iconSize: T.number,
  theme: T.object.isRequired,
}

export default withTheme(DynamicChip)
