import { tweenValues } from '../../utils'

function paintGrid({
  canvasContext,
  width,
  height,
  pools,
  previousPools,
  yTicks,
  previousYTicks,
  tweenPosition,
  theme,
}) {
  const poolsFloat = tweenValues(
    previousPools.length,
    pools.length,
    tweenPosition
  )
  const cellWidth = width / poolsFloat

  const yTicksFloat = tweenValues(
    previousYTicks.length,
    yTicks.length,
    tweenPosition
  )
  const cellHeight = height / yTicksFloat

  const strokeCol = theme.color('background', 2)

  canvasContext.lineWidth = 1
  canvasContext.strokeStyle = strokeCol

  canvasContext.beginPath() // Necessary for clearRect to work
  canvasContext.moveTo(0, 0)

  let poolIndex = 0
  const poolEnd = Math.max(pools.length, previousPools.length)
  while (poolIndex < poolEnd) {
    const xPos = poolIndex * cellWidth
    canvasContext.moveTo(xPos, 0)
    canvasContext.lineTo(xPos, height)

    poolIndex++
  }

  let yTickIndex = 0
  const yTickEnd = Math.max(yTicks.length, previousYTicks.length)
  while (yTickIndex < yTicks.length) {
    const yPos = height - yTickIndex * cellHeight
    canvasContext.moveTo(0, yPos)
    canvasContext.lineTo(width, yPos)

    yTickIndex++
  }

  canvasContext.moveTo(0, 0)
  canvasContext.closePath()
  canvasContext.stroke()

  return {
    cellWidth,
    cellHeight,
    countPerCell: yTicks[1] - yTicks[0],
  }
}

export default paintGrid
