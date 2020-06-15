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
    const hexChar = value.charCodeAt(i).toString(16)
    hex = i % 2 ? `${hex}${hexChar}` : `${hexChar}${hex}`
  }
  return hex
}

function DynamicChip({
  value,
  splitter = '/',
  splitIndex = 0,
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
    if (parts.length > splitIndex + 1) {
      // Give values like 'something/1.2' and 'something/mod/2.6' same hue, different saturations
      const start = parts.slice(0, splitIndex + 1).join(splitter)
      const end = splitter + parts.slice(splitIndex + 1).join(splitter)
      hsl = colorHash.hsl(getHex(start))
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
        size: 7,
        width: iconSize,
        hash: hex
          .split('')
          .reverse()
          .join(''),
      }
      const shape = identicon(identiconProps).replace(
        /="#\w+"/g,
        `="${iconColor}"`
      )
      const shape2 = identicon({
        ...identiconProps,
        hash: hex,
      }).replace(/="#\w+"/g, `="${theme.color('background')}"`)

      const svgTag = shape.match(/(<svg.*?>)/)[1]
      const paths1 = shape.match(/.*<svg.*?>(.*)<\/svg>/)[1]
      const paths2 = shape2.match(/.*<svg.*?>(.*)<\/svg>/)[1]

      const svg = `${svgTag}${paths2}${paths1}</svg>`
      svgB64 = btoa(svg)
    }

    return {
      color,
      backgroundColor,
      glowColor,
      svgB64,
    }
  }, [value, splitter, splitIndex, glow, iconSize, theme])

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
  splitIndex: T.number,
}

export default withTheme(DynamicChip)
