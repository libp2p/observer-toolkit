import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  border-radius: 50%;
  ${({ size }) => `
    height: ${size}px;
    width: ${size}px;
  `}
  ${({ inline, theme, size }) =>
    !inline
      ? ''
      : `
    display: inline-block;
    vertical-align: middle;
    margin-left: ${theme.spacing()};
    margin-right: ${theme.spacing(-0.5, true) - size / 2}px;
  `}
`

const BubbleShape = styled.div.attrs(({ percentOfSize }) => {
  const offset = (100 - percentOfSize) / 2
  return {
    style: {
      height: `${percentOfSize}%`,
      width: `${percentOfSize}%`,
      marginTop: `${offset}%`,
      marginLeft: `${offset}%`,
      marginRight: `${offset}%`,
      marginBottom: `${offset}%`,
    },
  }
})`
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.color('background', 0, 0.8)};
  background: ${({ theme, colorKey, colorIndex = 0 }) =>
    colorKey ? theme.color(colorKey, colorIndex) : 'currentColor'};
`

function Bubble({
  value,
  maxValue,
  colorKey,
  inline = false,
  size = 32,
  colorIndex = 0,
  override = {},
}) {
  if (!maxValue) return ''

  // Make _area_ of circle relative to value
  const percentOfSize = Math.sqrt(value / maxValue) * 100
  return (
    <Container size={size} inline={inline} as={override.Container}>
      <BubbleShape
        colorKey={colorKey}
        colorIndex={colorIndex}
        percentOfSize={percentOfSize}
        as={override.BubbleShape}
      />
    </Container>
  )
}

Bubble.propTypes = {
  value: T.number.isRequired,
  maxValue: T.number,
  size: T.number,
  inline: T.bool,
  colorKey: T.string,
  colorIndex: T.number,
  override: T.object,
}

export default Bubble
