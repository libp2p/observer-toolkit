import { tweenValues } from '../../utils'

const noop = () => {}

function paintBars({
  counts,
  previousCounts,
  cellWidth,
  cellHeight,
  canvasContext,
  width,
  height,
  hotSpots,
  actions,
  tweenPosition,
  theme,
}) {
  canvasContext.fillStyle = theme.color('tertiary', 3)
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

    hotSpots.push({
      action: actions[barIndex] || noop,
      area: {
        x,
        y,
        width: barWidth,
        height: barHeight,
      },
    })

    barIndex++
  }

  canvasContext.fill()
}

export default paintBars
