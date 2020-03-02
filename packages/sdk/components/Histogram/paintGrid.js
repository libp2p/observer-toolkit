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
  xAxisSpace = 0,
  yAxisSpace = 0,
  theme,
}) {
  const innerWidth = width - xAxisSpace
  const innerHeight = height - yAxisSpace

  const poolsFloat = tweenValues(
    previousPools.length,
    pools.length,
    tweenPosition
  )
  const cellWidth = innerWidth / poolsFloat

  const yTicksFloat = tweenValues(
    previousYTicks.length,
    yTicks.length,
    tweenPosition
  )
  const cellHeight = innerHeight / yTicksFloat

  const strokeCol = theme.color('background', 0, 0.8)
  const fillCol = theme.color('text', 2)

  canvasContext.lineWidth = 1
  canvasContext.strokeStyle = strokeCol
  canvasContext.fillStyle = fillCol
  canvasContext.textAlign = 'center'
  canvasContext.textBaseline = 'middle'

  canvasContext.beginPath() // Necessary for clearRect to work
  canvasContext.moveTo(0, 0)

  let poolIndex = 0
  const poolEnd = Math.max(pools.length, previousPools.length)
  while (poolIndex < poolEnd) {
    const xPos = poolIndex * cellWidth + xAxisSpace
    canvasContext.moveTo(xPos, 0)
    canvasContext.lineTo(xPos, innerHeight)
    if (yAxisSpace > 5)
      canvasContext.fillText(pools[poolIndex], xPos, height - 5)

    poolIndex++
  }

  canvasContext.textAlign = 'right'

  let yTickIndex = 0
  const yTickEnd = Math.max(yTicks.length, previousYTicks.length)
  while (yTickIndex < yTicks.length) {
    const yPos = innerHeight - yTickIndex * cellHeight
    canvasContext.moveTo(xAxisSpace, yPos)
    canvasContext.lineTo(width, yPos)
    if (xAxisSpace)
      canvasContext.fillText(yTicks[yTickIndex], xAxisSpace - 4, yPos)

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
