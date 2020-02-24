import React, { useCallback, useContext } from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import { DhtQueryContext } from './context/DhtQueryProvider'

import { useCanvas } from '@libp2p-observer/sdk'

// TODO: make this configurable and / or come from data
const timeResolution = 1000
const cutoff = 15000

const glowDuration = 600

const outerSize = 24
const innerSize = 18
const gutterSize = (outerSize - innerSize) / 2
const maxGlowSize = 12

const Container = styled.div.attrs(({ age }) => ({
  style: {
    transform: `scale(${0.5 * Math.min(1, age / cutoff) + 0.5})`,
  },
}))`
  position: relative;
  width: ${outerSize}px;
  height: ${outerSize}px;
`

const Canvas = styled.canvas`
  position: relative;
  height: inherit;
  width: inherit;
  z-index: 5;
`

const InnerChip = styled.div`
  position: absolute;
  width: ${innerSize}px;
  height: ${innerSize}px;
  background: ${({ theme, status }) =>
    status === 'ACTIVE'
      ? theme.color('contrast', 2)
      : theme.color('background', 2, 0.25)};
  top: ${gutterSize}px;
  left: ${gutterSize}px;
  ${({ theme }) => theme.transition()}
`

function peakHalfWay(timeSinceQuery) {
  const halfTime = glowDuration / 2

  const diff = halfTime - Math.abs(timeSinceQuery - halfTime)
  const dec = diff / halfTime
  return dec
}

function paintActiveGlow(timeSinceQuery, canvasContext, direction, theme) {
  const completion = timeSinceQuery / glowDuration

  const midwayDec = peakHalfWay(timeSinceQuery)

  const size = midwayDec * maxGlowSize
  const coordPlacement = direction === 'in' ? 0.3 : 0.7
  const coord = outerSize * coordPlacement
  const innerCoord = coord + outerSize * (completion - 0.5)

  const colorKey = direction === 'in' ? 'primary' : 'secondary'
  const cols = [
    theme.color('background', 0, 0.5 + midwayDec / 2),
    theme.color(colorKey, 0, midwayDec / 2),
    theme.color(colorKey, 0, 0),
  ]

  const gradient = canvasContext.createRadialGradient(
    coord,
    coord,
    0,
    innerCoord,
    innerCoord,
    size
  )
  gradient.addColorStop(0, cols[0])
  gradient.addColorStop(0.25 + midwayDec / 2, cols[1])
  gradient.addColorStop(1, cols[2])

  canvasContext.fillStyle = gradient
  canvasContext.fillRect(0, 0, outerSize, outerSize)
}

function paintResidualGlow(
  queries,
  currentTime,
  canvasContext,
  direction,
  theme
) {
  const { filtered, total, totalWeighted } = queries.reduce(
    (obj, { start: queryTime }) => {
      const timeSinceQuery = currentTime - queryTime
      if (queryTime + glowDuration > currentTime || timeSinceQuery > cutoff)
        return obj
      return {
        filtered: [...obj.filtered, timeSinceQuery],
        total: obj.total + timeSinceQuery,
        totalWeighted: obj.totalWeighted + (1 - timeSinceQuery / cutoff),
      }
    },
    {
      filtered: [],
      total: 0,
      totalWeighted: 0,
    }
  )

  const coord = outerSize * (direction === 'in' ? 0.2 : 0.8)

  const meanTimeSinceQuery = filtered.length ? total / filtered.length : 0
  const midStopPosition = meanTimeSinceQuery / cutoff

  const maxWeightedTotal = 10 // An arbitray figure for the max opacity
  const opacity = Math.min(1, Math.sqrt(totalWeighted / maxWeightedTotal))

  const colorKey = direction === 'in' ? 'primary' : 'secondary'
  const colorIndex = direction === 'in' ? 0 : 1
  const cols = [
    theme.color(colorKey, colorIndex, opacity),
    theme.color(colorKey, colorIndex, opacity / 2),
    theme.color(colorKey, colorIndex, 0),
  ]

  const gradient = canvasContext.createRadialGradient(
    coord,
    coord,
    0,
    coord,
    coord,
    maxGlowSize
  )
  gradient.addColorStop(0, cols[0])
  gradient.addColorStop(0.2 + midStopPosition * 0.8, cols[1])
  gradient.addColorStop(1, cols[2])

  canvasContext.fillStyle = gradient
  canvasContext.fillRect(gutterSize, gutterSize, innerSize, innerSize)
}

function paintQueryGlows({
  canvasContext,
  queries,
  stateStartTime,
  msSinceRender,
  theme,
  direction,
}) {
  const currentTime = stateStartTime + msSinceRender

  const activeQueries = queries.filter(
    ({ start: queryTime }) =>
      queryTime <= currentTime && currentTime - queryTime <= glowDuration
  )

  paintResidualGlow(queries, currentTime, canvasContext, direction, theme)

  if (!activeQueries.length) return false

  activeQueries.forEach(({ start: queryTime }) =>
    paintActiveGlow(currentTime - queryTime, canvasContext, direction, theme)
  )

  return true
}

function DhtPeer({
  inboundQueries = [],
  outboundQueries = [],
  peerId,
  age,
  status,
  timestamp,
  theme,
}) {
  const queriesByPeerId = useContext(DhtQueryContext)

  if (queriesByPeerId[peerId]) {
    inboundQueries = queriesByPeerId[peerId].INBOUND
    outboundQueries = queriesByPeerId[peerId].OUTBOUND
  }

  // Get queries from context / hook, but allow props to override e.g. storybook demos
  if (!inboundQueries) inboundQueries = queriesByPeerId[peerId].INBOUND
  if (!outboundQueries) outboundQueries = queriesByPeerId[peerId].OUTBOUND

  const animateCanvas = useCallback(
    ({ canvasContext, width, height, clearAnimation } = {}) => {
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
    <Container age={age}>
      <Canvas ref={canvasRef} />
      <InnerChip age={age} status={status} />
    </Container>
  )
}

DhtPeer.propTypes = {
  inboundQueries: T.array.isRequired,
  outboundQueries: T.array.isRequired,
  age: T.number.isRequired,
  peerId: T.string.isRequired,
  status: T.string.isRequired,
  timestamp: T.number.isRequired,
  theme: T.object.isRequired,
}

export default withTheme(DhtPeer)
