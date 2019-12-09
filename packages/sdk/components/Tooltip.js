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
  z-index: 15;
  position: absolute;
  ${({ direction, tickSize }) =>
    getPosition(direction, `calc(100% - ${tickSize}px)`, '-50%')}

  // Give a little space that tolerates small mouseouts around the tick shape
  ${({ direction, tickSize }) =>
    `border-${direction}: ${tickSize * 2}px solid transparent`};
`

const Content = styled.div`
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing()} ${theme.spacing(2)}`};
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

const sideOptions = ['top', 'right', 'bottom', 'left']
const fixOnOptions = ['click', 'always', 'never']

function Tooltip({
  children,
  tickSize = 8,
  colorKey = 'background',
  colorIndex = 0,
  side = sideOptions[0],
  fixOn = fixOnOptions[0],
  content,
  override = {},
}) {
  const clickToFix = fixOn === 'click'
  const alwaysFix = fixOn === 'always'

  const [isFixed, setIsFixed] = useState(alwaysFix)
  const [isShowing, setIsShowing] = useState(false)

  if (!content) return <Target>{children}</Target>

  const show = () => setIsShowing(true)
  const hide = () => setIsShowing(false)
  const toggleFix = () => setIsFixed(!isFixed)
  const stopPropagation = e => e.stopPropagation()

  const direction = getInvertedDirection(side)
  const getColor = theme => theme.color(colorKey, colorIndex)

  return (
    <Target
      onMouseEnter={show}
      onMouseLeave={hide}
      onClick={clickToFix ? toggleFix : null}
      clickToFix={clickToFix}
      isFixed={isFixed}
      as={override.Target}
    >
      {children}
      {(isFixed || isShowing) && (
        <Positioner
          onClick={clickToFix ? stopPropagation : null}
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
          <Content getColor={getColor} isFixed={isFixed} as={override.Content}>
            {content}
          </Content>
        </Positioner>
      )}
    </Target>
  )
}

Tooltip.propTypes = {
  children: T.node.isRequired,
  tickSize: T.number,
  getColor: T.func,
  side: T.oneOf(sideOptions),
  fixOn: T.oneOf(fixOnOptions),
  content: T.node,
  override: T.object,
}

export default Tooltip
