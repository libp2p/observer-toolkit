import React, { useEffect } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { withResizeDetector } from 'react-resize-detector'

import { useCanvas } from '../hooks'
import { isInsideRect } from '../utils'

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`

function CanvasCover({
  width,
  height,
  animateCanvas,
  animationDuration,
  hotSpotsRef,
}) {
  const { canvasRef } = useCanvas({
    width,
    height,
    animateCanvas,
    animationDuration,
  })

  useEffect(() => {
    if (!hotSpotsRef) return
    const handleMouseMove = e => {
      const match = hotSpotsRef.current.find(({ area }) =>
        isInsideRect(
          {
            x: e.offsetX,
            y: e.offsetY,
          },
          area
        )
      )
      if (match) {
        match.action()
      } else if (hotSpotsRef.current.defaultAction) {
        hotSpotsRef.current.defaultAction()
      }
    }

    canvasRef.current.addEventListener('mousemove', handleMouseMove)
  }, [canvasRef, hotSpotsRef])

  return <Canvas ref={canvasRef} />
}

CanvasCover.propTypes = {
  width: T.number,
  height: T.number,
  animateCanvas: T.func,
  animationDuration: T.number,
  hotSpotsRef: T.object,
  children: T.node,
}

export default withResizeDetector(CanvasCover)
