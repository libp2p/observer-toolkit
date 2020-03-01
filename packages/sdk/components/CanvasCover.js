import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { withResizeDetector } from 'react-resize-detector'

import { useCanvas } from '../hooks'

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`

function CanvasCover({
  width,
  height,
  animateCanvas,
  animationDuration,
  children,
}) {
  const { canvasRef } = useCanvas({
    width,
    height,
    animateCanvas,
    animationDuration,
  })

  return <Canvas ref={canvasRef} />
}

CanvasCover.propTypes = {
  width: T.number,
  height: T.number,
  animationGetter: T.func,
  children: T.node,
}

export default withResizeDetector(CanvasCover)
