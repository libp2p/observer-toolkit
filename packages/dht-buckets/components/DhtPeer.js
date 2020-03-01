import React, { useCallback, useContext, useRef, useEffect } from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import { getKademliaDistance } from '@libp2p-observer/data'
import { useCanvas, RuntimeContext, Tooltip } from '@libp2p-observer/sdk'

import { DhtQueryContext } from './context/DhtQueryProvider'
import DhtPeerInfo from './DhtPeerInfo'
import {
  getAbsolutePosition,
  diffAbsolutePositions,
  getTranslateString,
} from '../utils/positioning'
import { paintQueryGlows } from '../utils/paint'

import {
  timeResolution,
  cutoff,
  glowDuration,
  outerSize,
  innerSize,
  gutterSize,
  maxGlowSize,
} from '../utils/constants'

const Container = styled.div.attrs(({ age, theme }) => {
  const offset = Math.sqrt(age) / 70
  const opacity = Math.min(0.4, Math.sqrt(age) / (cutoff * 0.1)) + 0.6
  return {
    style: {
      top: `-${offset}px`,
      left: `-${offset}px`,
      boxShadow: `${offset}px ${offset}px 1px 1px ${theme.color(
        'contrast',
        0,
        opacity
      )}`,
    },
  }
})`
  position: relative;
  width: ${outerSize}px;
  height: ${outerSize}px;
  margin-top: ${gutterSize}px;
  margin-left: ${gutterSize}px;
`

const Canvas = styled.canvas`
  position: relative;
  height: inherit;
  width: inherit;
  z-index: 5;
`

const InnerChip = styled.div.attrs(({ theme, age }) => {
  const opacity = Math.min(0.5, Math.sqrt(age) / (cutoff * 0.1))
  const color = theme.color('background', 0, opacity)
  return {
    style: {
      borderTopColor: color,
      borderLeftColor: color,
    },
  }
})`
  position: absolute;
  width: ${innerSize}px;
  height: ${innerSize}px;
  top: ${gutterSize}px;
  left: ${gutterSize}px;
  border-width: ${gutterSize}px;
  border-style: solid;
  border-color: transparent;
  border-color: transparent;
  background: ${({ theme, status }) =>
    status === 'ACTIVE'
      ? theme.color('contrast', 2)
      : theme.color('background', 2, 0.25)};
  ${({ theme }) => theme.transition()}
`

const Distance = styled.div`
  position: absolute;
  top: 6px;
  left: 0;
  width: ${outerSize}px;
  height: ${outerSize}px;
  color: ${({ theme }) => theme.color('contrast', 0, 0.9)};
  ${({ theme }) => theme.text('label', 'small')};
  text-align: center;
  font-weight: bold;
  z-index: 5;
  letter-spacing: -0.05em; // Ensure 3-digit numbers fit
`

function getTransitionStyles(slotRef, previousSlotRef) {
  const appear = [
    {
      transition: 'none',
      opacity: 0,
    },
    {
      transition: '300ms opacity ease-in',
      opacity: 1,
    },
  ]
  if (!previousSlotRef) return appear

  const noop = [
    {
      transition: 'none',
      transform: 'none',
    },
  ]
  const newSlot = slotRef.current
  const oldSlot = previousSlotRef.current

  if (!newSlot || !oldSlot || newSlot === oldSlot) return noop

  const oldPos = getAbsolutePosition(oldSlot)
  const newPos = getAbsolutePosition(newSlot)
  const diffPos = diffAbsolutePositions(oldPos, newPos)
  return [
    {
      transform: getTranslateString(diffPos),
      transition: 'none',
    },
    {
      transform: getTranslateString({ x: 0, y: 0 }),
      transition: '300ms transform ease-in-out',
    },
  ]
}

function DhtPeer({
  inboundQueries = [],
  outboundQueries = [],
  peerId,
  age,
  status,
  timestamp,
  theme,
  slotRef,
  previousSlotRef,
  showDistance = false,
}) {
  const queriesByPeerId = useContext(DhtQueryContext)
  const runtime = useContext(RuntimeContext)
  const distance = getKademliaDistance(peerId, runtime.getPeerId())

  const peerRef = useRef()
  const transitionStyles = getTransitionStyles(slotRef, previousSlotRef)
  useEffect(() => {
    const applyTransitionStyles = async i => {
      const styles = transitionStyles[i]
      if (!styles || !peerRef.current) return
      Object.entries(styles).forEach(([key, style]) => {
        peerRef.current.style[key] = style
      })
      setTimeout(() => applyTransitionStyles(i + 1), 0)
    }
    applyTransitionStyles(0)
  })

  if (queriesByPeerId[peerId]) {
    inboundQueries = queriesByPeerId[peerId].INBOUND
    outboundQueries = queriesByPeerId[peerId].OUTBOUND
  }

  // Get queries from context / hook, but allow props to override e.g. storybook demos
  if (!inboundQueries) inboundQueries = queriesByPeerId[peerId].INBOUND
  if (!outboundQueries) outboundQueries = queriesByPeerId[peerId].OUTBOUND

  const animateCanvas = useCallback(
    ({ canvasContext, width, height } = {}) => {
      const timeOfRender = performance.now()
      const stateStartTime = timestamp - timeResolution

      return () => {
        // Don't use timestamps provided by requestAnimationFrame here, because
        // they are relative to a different start point than performance.now()
        const timeOfFrame = performance.now()

        const msSinceRender = timeOfFrame - timeOfRender

        const paintProps = {
          width,
          height,
          canvasContext,
          stateStartTime,
          msSinceRender,
          theme,
        }

        canvasContext.clearRect(0, 0, width, height)
        const anyInboundGlow = paintQueryGlows({
          direction: 'in',
          queries: inboundQueries,
          ...paintProps,
        })
        const anyOutboundGlow = paintQueryGlows({
          direction: 'out',
          queries: outboundQueries,
          ...paintProps,
        })

        // Continue animating only if there's an active glow
        return anyInboundGlow || anyOutboundGlow
      }
    },
    [timestamp, theme, inboundQueries, outboundQueries]
  )

  const { canvasRef } = useCanvas({
    width: outerSize,
    height: outerSize,
    animateCanvas,
  })

  return (
    <Container age={age} ref={peerRef}>
      <Tooltip
        content={
          <DhtPeerInfo
            peerId={peerId}
            status={status}
            age={age}
            distance={distance}
            inboundQueries={inboundQueries}
            outboundQueries={outboundQueries}
          />
        }
      >
        <Canvas ref={canvasRef} />
        <InnerChip age={age} status={status} />
        {showDistance && <Distance>{distance}</Distance>}
      </Tooltip>
    </Container>
  )
}

DhtPeer.propTypes = {
  inboundQueries: T.array,
  outboundQueries: T.array,
  age: T.number.isRequired,
  peerId: T.string.isRequired,
  status: T.string.isRequired,
  timestamp: T.number.isRequired,
  theme: T.object.isRequired,
}

export default withTheme(DhtPeer)
