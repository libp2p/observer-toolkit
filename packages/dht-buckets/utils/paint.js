import {
  outerSize,
  cutoff,
  glowDuration,
  maxGlowSize,
  gutterSize,
  innerSize,
} from './constants'

function _peakHalfWay(timeSinceQuery) {
  const halfTime = glowDuration / 2

  const diff = halfTime - Math.abs(timeSinceQuery - halfTime)
  const dec = diff / halfTime
  return dec
}

function paintQueryGlows({
  canvasContext,
  queries,
  stateStartTime,
  msSinceRender,
  theme,
  direction,
}) {
  const currentTime = stateStartTime + msSinceRender

  const activeQueries = queries.filter(
    ({ start: queryTime }) =>
      queryTime <= currentTime && currentTime - queryTime <= glowDuration
  )

  paintResidualGlow(queries, currentTime, canvasContext, direction, theme)

  if (!activeQueries.length) return false

  activeQueries.forEach(({ start: queryTime }) =>
    paintActiveGlow(currentTime - queryTime, canvasContext, direction, theme)
  )

  return true
}

function paintResidualGlow(
  queries,
  currentTime,
  canvasContext,
  direction,
  theme
) {
  const { filtered, total, totalWeighted } = queries.reduce(
    (obj, { start: queryTime }) => {
      const timeSinceQuery = currentTime - queryTime
      if (queryTime + glowDuration > currentTime || timeSinceQuery > cutoff)
        return obj
      return {
        filtered: [...obj.filtered, timeSinceQuery],
        total: obj.total + timeSinceQuery,
        totalWeighted: obj.totalWeighted + (1 - timeSinceQuery / cutoff),
      }
    },
    {
      filtered: [],
      total: 0,
      totalWeighted: 0,
    }
  )

  const coord = outerSize * (direction === 'in' ? 0.2 : 0.8)

  const meanTimeSinceQuery = filtered.length ? total / filtered.length : 0
  const midStopPosition = meanTimeSinceQuery / cutoff

  const maxWeightedTotal = 10 // An arbitray figure for the max opacity
  const opacity = Math.min(1, Math.sqrt(totalWeighted / maxWeightedTotal))

  const colorKey = direction === 'in' ? 'primary' : 'secondary'
  const colorIndex = direction === 'in' ? 0 : 1
  const cols = [
    theme.color(colorKey, colorIndex, opacity),
    theme.color(colorKey, colorIndex, opacity / 2),
    theme.color(colorKey, colorIndex, 0),
  ]

  const gradient = canvasContext.createRadialGradient(
    coord,
    coord,
    0,
    coord,
    coord,
    maxGlowSize
  )
  gradient.addColorStop(0, cols[0])
  gradient.addColorStop(0.2 + midStopPosition * 0.8, cols[1])
  gradient.addColorStop(1, cols[2])

  canvasContext.fillStyle = gradient
  canvasContext.fillRect(gutterSize, gutterSize, innerSize, innerSize)
}

function paintActiveGlow(timeSinceQuery, canvasContext, direction, theme) {
  const completion = timeSinceQuery / glowDuration

  const midwayDec = _peakHalfWay(timeSinceQuery)

  const size = midwayDec * maxGlowSize
  const coordPlacement = direction === 'in' ? 0.3 : 0.7
  const coord = outerSize * coordPlacement
  const innerCoord = coord + outerSize * (completion - 0.5)

  const colorKey = direction === 'in' ? 'primary' : 'secondary'
  const cols = [
    theme.color('background', 0, 0.5 + midwayDec / 2),
    theme.color(colorKey, 0, midwayDec / 2),
    theme.color(colorKey, 0, 0),
  ]

  const gradient = canvasContext.createRadialGradient(
    coord,
    coord,
    0,
    innerCoord,
    innerCoord,
    size
  )
  gradient.addColorStop(0, cols[0])
  gradient.addColorStop(0.25 + midwayDec / 2, cols[1])
  gradient.addColorStop(1, cols[2])

  canvasContext.fillStyle = gradient
  canvasContext.fillRect(0, 0, outerSize, outerSize)
}

export { paintQueryGlows, paintResidualGlow, paintActiveGlow }
