import { useEffect, useMemo, useRef } from 'react'

function getScaledContext(canvasElem, width, height, canvasContextType) {
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

function useCanvas({
  width,
  height,
  canvasContextType = '2d',
  animateCanvas = null,
}) {
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

  const canvasElem = canvasRef.current || null

  const canvasContext = useMemo(
    () => getScaledContext(canvasElem, width, height, canvasContextType),
    [canvasElem, width, height, canvasContextType]
  )

  useEffect(() => {
    if (!(canvasElem instanceof HTMLCanvasElement)) return

    const animateFrame = animateCanvas({
      canvasContext,
      canvasElem,
      width,
      height,
      animationRef,
    })

    const animate = timestamp => {
      animationRef.current.isAnimating = animateFrame(timestamp)
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
    canvasContext,
  }
}

export default useCanvas
