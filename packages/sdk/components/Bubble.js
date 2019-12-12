import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  border-radius: 50%;
  ${({ size }) => `
    height: ${size}px;
    width: ${size}px;
  `}
  ${({ inline, theme }) =>
    !inline
      ? ''
      : `
    display: inline-block;
    vertical-align: middle;
    margin: 0 ${theme.spacing()};
  `}
`

const BubbleShape = styled.div`
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.color('background', 0, 0.8)};
  background: ${({ theme, colorKey, colorIndex = 0 }) =>
    colorKey ? theme.color(colorKey, colorIndex) : 'currentColor'};
  ${({ percentOfSize }) => {
    const offset = (100 - percentOfSize) / 2
    return `
      height: ${percentOfSize}%;
      width: ${percentOfSize}%;
      margin-top: ${offset}%;
      margin-left: ${offset}%;
      margin-right: ${offset}%;
      margin-bottom: ${offset}%;
    `
  }}
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
  maxValue: T.number.isRequired,
  size: T.number,
  inline: T.bool,
  colorKey: T.string,
  colorIndex: T.number,
  override: T.object,
}

export default Bubble
