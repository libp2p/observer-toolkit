import React, { useLayoutEffect, useRef, useState } from 'react'
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

function getPosition(direction, mainPosition) {
  const isVertical = ['top', 'bottom'].includes(direction)
  const centredSide = isVertical ? 'left' : 'top'

  const centredAxis = isVertical ? 'X' : 'Y'

  return `
    ${direction}: ${mainPosition};
    ${centredSide}: 50%;
    transform: translate${centredAxis}(-50%);
  `
}

function getTickPosition(direction, tickSize) {
  return getPosition(direction, `-${tickSize * 2}px`)
}

function updateOffset(positionerRef, tickRef, containerRef, tolerance) {
  if (!positionerRef.current || !tickRef.current || !containerRef.current)
    return

  const elemRect = positionerRef.current.getBoundingClientRect()
  const boundsRect = containerRef.current.getBoundingClientRect()

  const { marginLeft, marginTop } = positionerRef.current.style
  const currentLeft = parseFloat(marginLeft)
  const currentTop = parseFloat(marginTop)

  const offsets = {
    top: Math.min(0, elemRect.top - boundsRect.top - currentTop + tolerance),
    left: Math.min(
      0,
      elemRect.left - boundsRect.left - currentLeft + tolerance
    ),
    right: Math.max(
      0,
      elemRect.right - boundsRect.right - currentLeft - tolerance
    ),
    bottom: Math.max(
      0,
      elemRect.bottom - boundsRect.bottom - currentTop - tolerance
    ),
  }

  // Don't apply contradictory offsets if a big tooltip spans both edges of a small view
  if (!(offsets.left && offsets.right)) {
    const offset = offsets.left || offsets.right || 0
    positionerRef.current.style.marginLeft = 0 - offset + 'px'
    tickRef.current.style.marginLeft = offset + 'px'
  }

  if (!(offsets.top && offsets.bottom)) {
    const offset = offsets.top || offsets.bottom || 0
    positionerRef.current.style.marginTop = 0 - offset + 'px'
    tickRef.current.style.marginTop = offset + 'px'
  }
}

const Target = styled.span`
  position: relative;
  display: inline-block;
  ${({ clickToFix, isFixed, theme }) =>
    clickToFix &&
    `
    cursor: pointer;
    ${isFixed && theme.boxShadow()}
  `}
`

const Positioner = styled.div`
  z-index: 15;
  position: absolute;
  ${({ direction, tickSize, offsets }) =>
    getPosition(direction, `calc(100% - ${tickSize}px)`, offsets)}

  // Give a little space that tolerates small mouseouts around the tick shape
  ${({ direction, tickSize }) =>
    `border-${direction}: ${tickSize * 2}px solid transparent`};
`

const Content = styled.div`
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing()} ${theme.spacing(2)}`};
  background: ${({ theme, getColor }) => getColor(theme)};
  ${({ theme, isFixed }) => theme.boxShadow({ opacity: isFixed ? 0.4 : 0.2 })}
`

const Tick = styled.div`
  position: absolute;
  height: 0;
  width: 0;
  border-style: solid;
  border-width: ${({ tickSize }) => tickSize}px;
  border-color: transparent;
  z-index: 3;
  ${({ direction, theme, getColor }) =>
    getTickBorderColor(direction, getColor(theme))}
  ${({ direction, tickSize, offsets }) =>
    getTickPosition(direction, tickSize, offsets)}
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
  tolerance = 0,
  containerRef = {},
  override = {},
}) {
  const clickToFix = fixOn === 'click'
  const alwaysFix = fixOn === 'always'
  const [isFixed, setIsFixed] = useState(alwaysFix)
  const [isShowing, setIsShowing] = useState(false)

  const positionerRef = useRef()
  const tickRef = useRef()
  useLayoutEffect(() =>
    updateOffset(positionerRef, tickRef, containerRef, tolerance)
  )

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
          style={{ marginLeft: 0, marginTop: 0 }}
          onClick={clickToFix ? stopPropagation : null}
          direction={direction}
          tickSize={tickSize}
          ref={positionerRef}
          as={override.Positioner}
        >
          <Tick
            direction={direction}
            tickSize={tickSize}
            getColor={getColor}
            ref={tickRef}
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
  colorKey: T.string,
  colorIndex: T.index,
  side: T.oneOf(sideOptions),
  fixOn: T.oneOf(fixOnOptions),
  content: T.node,
  tolerance: T.number,
  override: T.object,
  containerRef: T.object,
}

export default Tooltip
