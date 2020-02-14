import { useMemo, useReducer } from 'react'
import T from 'prop-types'
import { scaleLinear, scaleTime, scaleLog } from 'd3'

function updatePoolings(oldPoolings, { action, poolings, index }) {
  const poolingsArray = Array.isArray(poolings) ? poolings : [poolings]
  switch (action) {
    case 'set':
      return poolingsArray
    case 'remove':
      return removePooling(oldPoolings, index)
    case 'add':
      return [...oldPoolings, ...poolingsArray]
    case 'edit':
      return editPooling(oldPoolings, poolingsArray)
  }
}

function removePooling(oldPoolings, index) {
  const newPoolings = [...oldPoolings]
  newPoolings.splice(index, 1)
  return newPoolings
}

function editPooling(oldPoolings, poolingsArray) {
  const newPoolings = [...oldPoolings]
  poolingsArray.forEach((pooling, orderedIndex) => {
    const index =
      typeof pooling.index === 'number' ? pooling.index : orderedIndex
    Object.assign(newPoolings[index], pooling)
  })
  return newPoolings
}

function getScaleType(type) {
  switch (type) {
    case 'linear':
      return scaleLinear
    case 'log':
      return scaleLog
    case 'time':
      return scaleTime
    default:
      throw new Error`Unrecognised data pooling type "${type}"`()
  }
}

function getPools(data, { mapData, poolsCount, poolType = 'linear' }) {
  const mappedData = mapData ? data.map(mapData) : data
  const scaler = getScaleType(poolType)()

  const { min, max } = mappedData.reduce(
    ({ min, max }, datum) => {
      return { min: Math.min(min, datum), max: Math.max(max, datum) }
    },
    { min: Infinity, max: -Infinity }
  )

  scaler.domain([min, max])
  scaler.nice(poolsCount)
  const pools = scaler.ticks(poolsCount)

  return pools
}

function poolData(data, poolSets, poolings, setIndex) {
  const pools = poolSets[setIndex]
  const { mapData } = poolings[setIndex]

  const poolLowerLimits = pools.slice(0, pools.length - 1)
  return poolLowerLimits.map((lowerLimit, poolIndex) => {
    const isLastPool = poolIndex + 1 === poolLowerLimits.length
    const upperLimit = pools[poolIndex + 1]

    const isWithinPool = datum => {
      const mappedDatum = mapData ? mapData(datum) : datum
      // e.g. if 80-90% shouldn't include === 90% but 90-100% should include === 100%
      if (mappedDatum === upperLimit && isLastPool) return true
      if (mappedDatum >= lowerLimit && mappedDatum < upperLimit) return true
      return false
    }
    const dataWithinLimits = data.filter(isWithinPool)

    if (poolSets.length <= setIndex + 1) return dataWithinLimits

    return poolData(dataWithinLimits, poolSets, poolings, setIndex + 1)
  })
}

function usePooledData({ data, poolings = {} }) {
  const [poolingsArray, dispatchPoolings] = useReducer(
    updatePoolings,
    poolings,
    initial => updatePoolings([], { action: 'set', poolings: initial })
  )

  const { pooledData, poolSets } = useMemo(() => {
    const poolSets = poolingsArray.map((pooling, index) =>
      getPools(data, pooling)
    )
    const pooledData = poolData(data, poolSets, poolingsArray, 0)

    return {
      pooledData,
      poolSets,
    }
  }, [data, poolingsArray])

  return {
    dispatchPoolings,
    pooledData,
    poolSets,
  }
}

export default usePooledData
