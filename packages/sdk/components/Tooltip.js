import React, { useLayoutEffect, useRef, useState } from 'react'
import T from 'prop-types'
import styled, { css } from 'styled-components'

import Icon from './Icon'

function getDefaultContainer() {
  const root = document.getElementById('root')
  if (root) return root.firstChild
  return document.body.firstChild
}

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

function getPosition(
  direction,
  mainPosition,
  hangPosition = null,
  noTransform = false
) {
  const isHanging = typeof hangPosition === 'number'
  const centredPosition = isHanging ? (hangPosition += 'px') : '50%'

  const isVertical = ['top', 'bottom'].includes(direction)
  const centredSide = isVertical ? 'left' : 'top'

  const centredAxis = isVertical ? 'X' : 'Y'

  return `
    ${direction}: ${mainPosition};
    ${centredSide}: ${centredPosition};
    ${noTransform ? '' : `transform: translate${centredAxis}(-50%);`}
  `
}

function getTickPosition(direction, tickSize, hang, theme) {
  const mainPosition = `-${tickSize * 2}px`
  if (typeof hang === 'number') {
    const hangPosition = theme.spacing(hang + 0.5, true) + tickSize
    return getPosition(direction, mainPosition, hangPosition)
  }
  return getPosition(direction, mainPosition)
}

function getOuterPosition(direction, mainPosition, hang, theme) {
  if (typeof hang === 'number') {
    const hangPosition = -1 * theme.spacing(hang, true)
    return getPosition(direction, mainPosition, hangPosition, true)
  }
  return getPosition(direction, mainPosition)
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
  ) {
    return
  }

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
  ${({ direction, tickSize, hang, theme }) =>
    getOuterPosition(direction, '100%', hang, theme)}

  // Give a little space that tolerates small mouseouts around the tick shape
  ${({ direction, tickSize }) =>
    `border-${direction}: ${tickSize}px solid transparent`};
`

const Content = styled.div`
  text-align: left;
  padding: ${({ theme, isClosable }) =>
    theme.spacing([1, isClosable ? 3 : 1, 1, 1])};
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
  ${({ direction, tickSize, hang, theme }) =>
    getTickPosition(direction, tickSize, hang, theme)}
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
  hang = false,
  content,
  toleranceX = 0,
  toleranceY = 0,
  containerRef = { current: getDefaultContainer() },
  initiallyOpen = false,
  hidePrevious,
  override = {},
}) {
  const clickToFix = fixOn === 'click'
  const alwaysFix = fixOn === 'always'
  const noHover = fixOn === 'no-hover'
  const isClickable = clickToFix || noHover

  if (hang && typeof hang !== 'number') {
    // Allow 'hang' passed as true for a standard, overrideable hang amount
    hang = 2
  }

  const [isFixed, setIsFixed] = useState(alwaysFix || initiallyOpen)
  const [isShowing, setIsShowing] = useState(false)

  const positionerRef = useRef()
  const tickRef = useRef()
  useLayoutEffect(() =>
    updateOffset(positionerRef, tickRef, containerRef, toleranceX, toleranceY)
  )

  if (!content) return <Target>{children}</Target>

  const hide = () => {
    if (hidePrevious) hidePrevious(null)
    setIsShowing(false)
  }
  const show = () => {
    if (hidePrevious) hidePrevious(hide)
    setIsShowing(true)
  }
  const unfix = () => {
    if (hidePrevious) hidePrevious(null)
    setIsFixed(false)
  }
  const fix = () => {
    if (hidePrevious) hidePrevious(unfix)
    setIsFixed(true)
  }
  const toggleShow = () => (isShowing ? hide() : show())
  const toggleFix = () => (isFixed ? unfix() : fix())

  const stopPropagation = e => e.stopPropagation()
  const getColor = theme => theme.color(colorKey, colorIndex)

  const isClosable = (clickToFix && isFixed) || noHover
  const close = () => {
    hide()
    unfix()
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
          hang={hang}
          ref={positionerRef}
          as={override.Positioner}
        >
          <Tick
            direction={direction}
            tickSize={tickSize}
            getColor={getColor}
            hang={hang}
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
  initiallyOpen: T.bool,
  hidePrevious: T.func,
  override: T.object,
  containerRef: T.object,
  hang: T.oneOfType([T.bool, T.number]),
}

export default Tooltip
