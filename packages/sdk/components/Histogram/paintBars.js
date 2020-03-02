import { tweenValues } from '../../utils'

function paintBars({
  counts,
  previousCounts,
  cellWidth,
  cellHeight,
  canvasContext,
  width,
  height,
  countPerCell,
  tweenPosition,
  xAxisSpace = 0,
  yAxisSpace = 0,
  theme,
}) {
  const innerHeight = height - yAxisSpace

  canvasContext.fillStyle = theme.color('tertiary', 3)
  canvasContext.strokeStyle = 'none'

  let barIndex = 0
  const barEnd = Math.max(counts.length, previousCounts.length)
  while (barIndex < barEnd) {
    const count = counts[barIndex] || 0
    const previousCount = previousCounts[barIndex] || 0

    const tweenedCount = tweenValues(previousCount, count, tweenPosition)
    const x = barIndex * cellWidth + 0.25 * cellWidth + xAxisSpace
    const barWidth = 0.5 * cellWidth
    const barHeight = (tweenedCount / countPerCell) * cellHeight
    const y = innerHeight - barHeight

    canvasContext.rect(x, y, barWidth, barHeight)

    barIndex++
  }

  canvasContext.fill()
}

export default paintBars
