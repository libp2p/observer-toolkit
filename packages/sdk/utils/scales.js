import { scaleLinear, scaleTime, scaleLog } from 'd3'

import { getMinMaxValues } from './helpers'

const scaleMakers = {
  linear: scaleLinear,
  log: scaleLog,
  time: scaleTime,
}

function getScale(type) {
  const scaleMaker = scaleMakers[type]
  if (!scaleMaker) throw new Error(`Unrecognised scale type "${type}"`)

  return scaleMaker()
}

function getTicks({
  data,
  mapData,
  ticksCount,
  scaleType = 'linear',
  min,
  max,
}) {
  const mappedData = mapData ? data.map(mapData) : data
  const scaler = getScale(scaleType)

  const { min: currentMin, max: currentMax } = getMinMaxValues(mappedData)

  const hasDefinedMin = typeof min === 'number'
  const hasDefinedMax = typeof max === 'number'

  const appliedMin = hasDefinedMin ? min : currentMin
  const appliedMax = hasDefinedMax ? max : currentMax

  scaler.domain([appliedMin, appliedMax])
  scaler.nice(ticksCount)
  let ticks = scaler.ticks(ticksCount)

  // "niced" auto d3 ticks *should* always enclose domain, but don't always, especially
  // with log scales: e.g. [ 0.01, 1, 100 ], max = 999, upper domain niced to 1000
  let redoDomain = false
  let [domainLower, domainUpper] = scaler.domain()
  if (!hasDefinedMin && ticks[0] > currentMin) {
    redoDomain = true
    switch (scaleType) {
      case 'linear':
        domainLower = ticks[0] - (ticks[1] - ticks[0])
        break
      case 'log':
        domainLower = ticks[0] * (ticks[0] / ticks[1])
        break
    }
  }
  const lastIndex = ticks.length - 1
  if (!hasDefinedMax && ticks[lastIndex] < currentMax) {
    redoDomain = true
    switch (scaleType) {
      case 'linear':
        domainUpper = ticks[lastIndex] + (ticks[1] - ticks[0])
        break
      case 'log':
        domainUpper = ticks[lastIndex] * (ticks[1] / ticks[0])
        break
    }
  }

  if (redoDomain) {
    scaler.domain([domainLower, domainUpper])
    scaler.nice(ticksCount)
    ticks = scaler.ticks(ticksCount)
  }

  return ticks
}

export { scaleMakers, getScale, getTicks }
