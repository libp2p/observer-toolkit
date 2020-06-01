import { useEffect, useCallback, useRef } from 'react'
import T from 'prop-types'

function getScaledContext(canvasRef, width, height, canvasContextType) {
  const canvasElem = canvasRef.current
  if (!canvasElem) {
    return null
  }

  if (width === undefined || height === undefined) {
    const bbox = canvasElem.getBoundingClientRect()
    if (width === undefined) width = bbox.width
    if (height === undefined) height = bbox.height
  }

  const pixelRatio = window.devicePixelRatio || 1
  canvasElem.width = width * pixelRatio
  canvasElem.height = height * pixelRatio

  const canvasContext = canvasElem.getContext(canvasContextType)
  canvasContext.scale(pixelRatio, pixelRatio)

  return canvasContext
}

function getTweenPosition(startTime, animationDuration) {
  if (!animationDuration) return 1

  const now = performance.now()
  const timeElapsed = now - startTime
  return Math.min(1, timeElapsed / animationDuration)
}

function useCanvas(props) {
  T.checkPropTypes(useCanvas.propTypes, props, 'prop', 'useCanvas')
  const {
    width,
    height,
    canvasContextType = '2d',
    animateCanvas = null,
    animationDuration = 0,
    animationEasing,
  } = props

  const canvasRef = useRef()
  const animationRef = useRef({
    isAnimating: false,
    animationFrame: null,
    animate: () => {
      throw new Error('No animation assigned to animationRef')
    },
  })
  animationRef.current.clearAnimation = () => {
    const animationFrame = animationRef.current.animationFrame
    if (animationFrame) cancelAnimationFrame(animationFrame)
    animationRef.current.isAnimating = false
  }

  const getCanvasContext = useCallback(
    () => getScaledContext(canvasRef, width, height, canvasContextType),
    [canvasRef, width, height, canvasContextType]
  )

  useEffect(() => {
    const canvasElem = canvasRef.current
    if (!(canvasElem instanceof HTMLCanvasElement)) return

    const animateFrame = animateCanvas({
      canvasContext: getCanvasContext(),
      canvasElem,
      width,
      height,
      animationRef,
    })

    const startTime = performance.now()

    // reqAnimFrameTs is the timestamp passed in by requestAnimationFrame()
    // It is relative to a different time than performance.now() and so
    // will give odd results if used in comparisons with performance.now()
    const animate = reqAnimFrameTs => {
      const uneasedTweenPosition = getTweenPosition(
        startTime,
        animationDuration
      )
      const tweenPosition = animationEasing
        ? animationEasing(uneasedTweenPosition)
        : uneasedTweenPosition

      animationRef.current.isAnimating = animateFrame({
        tweenPosition,
        reqAnimFrameTs,
        startTime,
      })
      if (animationRef.current.isAnimating) {
        animationRef.current.animationFrame = requestAnimationFrame(animate)
      }
    }
    animationRef.current.animate = animate
    animationRef.current.animationFrame = requestAnimationFrame(animate)

    // Clear any hanging frames on dismount
    return animationRef.current.clearAnimation
  })

  return {
    canvasRef,
    animationRef,
    getCanvasContext,
  }
}
useCanvas.propTypes = {
  width: T.number,
  height: T.number,
  canvasContextType: T.string,
  animateCanvas: T.func,
  animationDuration: T.number,
  animationEasing: T.func,
}

export default useCanvas
