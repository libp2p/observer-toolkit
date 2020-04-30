import React, { useLayoutEffect, useRef, useState } from 'react'
import T from 'prop-types'
import styled, { css } from 'styled-components'

import Icon from './Icon'

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

function updateOffset(
  positionerRef,
  tickRef,
  containerRef,
  toleranceX,
  toleranceY
) {
  if (
    !containerRef ||
    !containerRef.current ||
    !positionerRef.current ||
    !tickRef.current
  )
    return

  const elemRect = positionerRef.current.getBoundingClientRect()
  const boundsRect = containerRef.current.getBoundingClientRect()

  const { marginLeft, marginTop } = positionerRef.current.style
  const currentLeft = parseFloat(marginLeft)
  const currentTop = parseFloat(marginTop)

  const snapX = toleranceX !== null
  const snapY = toleranceY !== null

  const offsetsX = snapX && {
    left: Math.min(
      0,
      elemRect.left - boundsRect.left - currentLeft + toleranceX
    ),
    right: Math.max(
      0,
      elemRect.right - boundsRect.right - currentLeft - toleranceX
    ),
  }
  const offsetsY = snapY && {
    top: Math.min(0, elemRect.top - boundsRect.top - currentTop + toleranceY),
    bottom: Math.max(
      0,
      elemRect.bottom - boundsRect.bottom - currentTop - toleranceY
    ),
  }

  // Don't apply contradictory offsets if a big tooltip spans both edges of a small view
  if (snapX && !(offsetsX.left && offsetsX.right)) {
    const offset = offsetsX.left || offsetsX.right || 0
    positionerRef.current.style.marginLeft = 0 - offset + 'px'
    tickRef.current.style.marginLeft = offset + 'px'
  }

  if (snapY && !(offsetsY.top && offsetsY.bottom)) {
    const offset = offsetsY.top || offsetsY.bottom || 0
    positionerRef.current.style.marginTop = 0 - offset + 'px'
    tickRef.current.style.marginTop = offset + 'px'
  }
}

const Target = styled.span.attrs(({ isOpen }) => ({
  'data-tooltip': isOpen ? 'open' : 'closed',
}))`
  position: relative;
  display: inline-block;
  ${({ isClickable, noHover, isFixed, theme }) =>
    isClickable
      ? css`
          cursor: pointer;
          ${isFixed ? theme.boxShadow() : ''}
        `
      : ''}
`

const Positioner = styled.div`
  z-index: 15;
  position: absolute;
  ${({ direction, tickSize, offsets }) =>
    getPosition(direction, '100%', offsets)}

  // Give a little space that tolerates small mouseouts around the tick shape
  ${({ direction, tickSize }) =>
    `border-${direction}: ${tickSize}px solid transparent`};
`

const Content = styled.div`
  text-align: left;
  padding: ${({ theme, isClosable }) =>
    theme.spacing([1, isClosable ? 3 : 2, 1, 2])};
  background: ${({ theme, getColor }) => getColor(theme)};
  ${({ theme, isFixed }) => theme.boxShadow({ opacity: isFixed ? 0.4 : 0.2 })}
  ${({ theme }) => theme.text('label', 'medium')}
`

const Tick = styled.div`
  position: absolute;
  height: 0;
  width: 0;
  pointer-events: none;
  border-style: solid;
  border-width: ${({ tickSize }) => tickSize}px;
  border-color: transparent;
  z-index: 3;
  ${({ direction, theme, getColor }) =>
    getTickBorderColor(direction, getColor(theme))}
  ${({ direction, tickSize, offsets }) =>
    getTickPosition(direction, tickSize, offsets)}
`

const CloseIcon = styled.a`
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  &:hover {
    background: ${({ theme }) => theme.color('background', 1)};
  }
`

const sideOptions = ['top', 'right', 'bottom', 'left']
const fixOnOptions = ['click', 'no-hover', 'always', 'never']

function Tooltip({
  children,
  tickSize = 8,
  colorKey = 'background',
  colorIndex = 0,
  side = sideOptions[0],
  fixOn = fixOnOptions[0],
  content,
  toleranceX = 0,
  toleranceY = 0,
  containerRef = { current: document.body },
  initiallyOpen = false,
  override = {},
}) {
  const clickToFix = fixOn === 'click'
  const alwaysFix = fixOn === 'always'
  const noHover = fixOn === 'no-hover'
  const isClickable = clickToFix || noHover

  const [isFixed, setIsFixed] = useState(alwaysFix || initiallyOpen)
  const [isShowing, setIsShowing] = useState(false)

  const positionerRef = useRef()
  const tickRef = useRef()
  useLayoutEffect(() =>
    updateOffset(positionerRef, tickRef, containerRef, toleranceX, toleranceY)
  )

  if (!content) return <Target>{children}</Target>

  const show = () => setIsShowing(true)
  const hide = () => setIsShowing(false)
  const toggleShow = () => setIsShowing(!isShowing)
  const toggleFix = () => setIsFixed(!isFixed)
  const stopPropagation = e => e.stopPropagation()
  const getColor = theme => theme.color(colorKey, colorIndex)

  const isClosable = (clickToFix && isFixed) || noHover
  const close = () => {
    setIsFixed(false)
    setIsShowing(false)
  }

  const direction = getInvertedDirection(side)

  const isOpen = isFixed || isShowing

  return (
    <Target
      onMouseEnter={noHover ? null : show}
      onMouseLeave={noHover ? null : hide}
      onClick={(clickToFix && toggleFix) || (noHover && toggleShow) || null}
      isClickable={isClickable}
      isFixed={isFixed}
      isOpen={isOpen}
      as={override.Target}
    >
      {children}
      {isOpen && (
        <Positioner
          style={{ marginLeft: 0, marginTop: 0 }}
          onClick={isClickable ? stopPropagation : null}
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
          <Content
            getColor={getColor}
            isFixed={isFixed}
            isClosable={isClosable}
            role="tooltip"
            as={override.Content}
          >
            {isClosable && (
              <CloseIcon>
                <Icon type="remove" active onClick={close} aria-label="Close" />
              </CloseIcon>
            )}
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
  colorIndex: T.number,
  side: T.oneOf(sideOptions),
  fixOn: T.oneOf(fixOnOptions),
  content: T.node,
  toleranceX: T.number,
  toleranceY: T.number,
  override: T.object,
  containerRef: T.object,
}

export default Tooltip
