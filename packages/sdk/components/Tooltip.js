import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

function getInvertedDirection(direction) {
  const directionInverse = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }
  return directionInverse[direction]
}

function getTickBorderColor(direction, color) {
  const invertedDirection = getInvertedDirection(direction)
  return `border-${invertedDirection}-color: ${color};`
}

function getPosition(direction, mainOffset, centredOffset) {
  const isVertical = ['top', 'bottom'].includes(direction)
  const centredSide = isVertical ? 'left' : 'top'
  const centredAxis = isVertical ? 'X' : 'Y'
  return `
    ${direction}: ${mainOffset};
    ${centredSide}: 50%;
    transform: translate${centredAxis}(-50%);
  `
}

function getTickPosition(direction, tickSize) {
  return getPosition(direction, `-${tickSize * 2}px`, `-${tickSize}px`)
}

function getBoxShadow(theme, weight) {
  return `box-shadow: 0 ${theme.spacing(0.5)} ${theme.spacing()} ${theme.color(
    'contrast',
    0,
    weight
  )};`
}

const Target = styled.span`
  position: relative;
  display: inline-block;
  ${({ clickToFix, isFixed, theme }) =>
    clickToFix &&
    `
    cursor: pointer;
    ${isFixed && getBoxShadow(theme, 0.2)}
  `}
`

const Positioner = styled.div`
  position: absolute;
  ${({ direction, tickSize }) =>
    getPosition(direction, `calc(100% + ${tickSize / 2}px)`, '-50%')}

  // Give a little space that tolerates small mouseouts around the tick shape
  ${({ direction, tickSize }) =>
    `border-${direction}: ${tickSize}px solid transparent`};
`

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing()};
  background: ${({ theme, getColor }) => getColor(theme)};
  ${({ theme, isFixed }) => getBoxShadow(theme, isFixed ? 0.5 : 0.3)}
`

const Tick = styled.div`
  position: absolute;
  height: 0;
  width: 0;
  border-style: solid;
  border-width: ${({ tickSize }) => tickSize}px;
  border-color: transparent;
  ${({ direction, theme, getColor }) =>
    getTickBorderColor(direction, getColor(theme))}
  ${({ direction, tickSize }) => getTickPosition(direction, tickSize)}
`

function Tooltip({
  side = 'top',
  tickSize = 8,
  getColor = theme => theme.color('background'),
  clickToFix = true,
  content,
  children,
  override = {},
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const show = () => setIsVisible(true)
  const hide = () => setIsVisible(false)
  const toggleFix = () => setIsFixed(!isFixed)

  const direction = getInvertedDirection(side)

  return (
    <Target
      as={override.ContentWrapper}
      onMouseEnter={show}
      onMouseLeave={hide}
      onClick={clickToFix && toggleFix}
      clickToFix={clickToFix}
      isFixed={isFixed}
    >
      {children}
      {(isFixed || isVisible) && (
        <Positioner
          direction={direction}
          tickSize={tickSize}
          as={override.Positioner}
        >
          <Tick
            direction={direction}
            tickSize={tickSize}
            getColor={getColor}
            as={override.Tick}
          />
          <Content
            getColor={getColor}
            isFixed={isFixed}
            as={override.Container}
          >
            {content}
          </Content>
        </Positioner>
      )}
    </Target>
  )
}

Tooltip.propTypes = {
  direction: T.oneOf(['top', 'right', 'bottom', 'left']),
  tickSize: T.number,
  content: T.node.isRequired,
  children: T.node.isRequired,
  override: T.object,
}

export default Tooltip
