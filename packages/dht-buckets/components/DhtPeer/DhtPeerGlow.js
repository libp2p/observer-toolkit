import React, { useCallback, useContext } from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import { useCanvas } from '@libp2p/observer-sdk'

import { DhtQueryContext } from '../context/DhtQueryProvider'
import { paintQueryGlows } from '../../utils/paint'

import { outerSize } from '../../utils/constants'

const Canvas = styled.canvas`
  position: relative;
  height: inherit;
  width: inherit;
  z-index: 5;
`

function DhtPeerGlow({
  inboundQueries = [],
  outboundQueries = [],
  peerId,
  timestamp,
  stateDuration,
  theme,
}) {
  const { queriesByPeerId } = useContext(DhtQueryContext)

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
      const stateStartTime = timestamp - stateDuration

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
    [timestamp, stateDuration, theme, inboundQueries, outboundQueries]
  )

  const { canvasRef } = useCanvas({
    width: outerSize,
    height: outerSize,
    animateCanvas,
  })

  return <Canvas ref={canvasRef} />
}

DhtPeerGlow.propTypes = {
  inboundQueries: T.array,
  outboundQueries: T.array,
  peerId: T.string.isRequired,
  timestamp: T.number.isRequired,
  stateDuration: T.number.isRequired,
  theme: T.object.isRequired,
}

export default withTheme(DhtPeerGlow)
