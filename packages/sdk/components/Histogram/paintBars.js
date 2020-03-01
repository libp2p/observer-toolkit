import { tweenValues } from '../../utils'

function paintBars({
  counts,
  previousCounts,
  cellWidth,
  cellHeight,
  canvasContext,
  width,
  height,
  tweenPosition,
  theme,
}) {
  canvasContext.fillStyle = 'red'
  canvasContext.strokeStyle = 'none'

  let barIndex = 0
  const barEnd = Math.max(counts.length, previousCounts.length)
  while (barIndex < barEnd) {
    const count = counts[barIndex] || 0
    const previousCount = previousCounts[barIndex] || 0

    const tweenedCount = tweenValues(previousCount, count, tweenPosition)
    const x = barIndex * cellWidth + 0.25 * cellWidth
    const barWidth = 0.5 * cellWidth
    const barHeight = tweenedCount * cellHeight
    const y = height - barHeight

    canvasContext.rect(x, y, barWidth, barHeight)

    barIndex++
  }

  canvasContext.fill()
}

export default paintBars
