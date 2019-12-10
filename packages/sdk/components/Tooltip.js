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

function getBoxShadow(theme, weight) {
  return `box-shadow: 0 ${theme.spacing(0.5)} ${theme.spacing()} ${theme.color(
    'contrast',
    0,
    weight
  )};`
}

function updateOffset(contentRef, containerRef, tolerance) {
  if (!contentRef.current || !containerRef.current) return

  const elemRect = contentRef.current.getBoundingClientRect()
  const boundsRect = containerRef.current.getBoundingClientRect()

  const { left, top } = contentRef.current.style
  const currentLeft = parseFloat(left)
  const currentTop = parseFloat(top)

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
  if (!(offsets.top && offsets.bottom)) {
    contentRef.current.style.left = 0 - (offsets.left || offsets.right) + 'px'
  }
  if (!(offsets.left && offsets.right)) {
    contentRef.current.style.top = 0 - (offsets.top || offsets.bottom) + 'px'
  }
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
  ${({ theme, isFixed }) => getBoxShadow(theme, isFixed ? 0.5 : 0.3)}
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

const ContentOffsetter = styled.div`
  position: relative;
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

  const contentRef = useRef()
  useLayoutEffect(() => updateOffset(contentRef, containerRef, tolerance))

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
          <ContentOffsetter style={{ top: 0, left: 0 }} ref={contentRef}>
            <Content
              getColor={getColor}
              isFixed={isFixed}
              as={override.Content}
            >
              {content}
            </Content>
          </ContentOffsetter>
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
