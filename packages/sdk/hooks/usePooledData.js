import { useMemo, useReducer } from 'react'
import T from 'prop-types'

import { getTicks } from '../utils'

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

function usePooledData(props) {
  T.checkPropTypes(usePooledData.propTypes, props, 'prop', 'usePooledData')
  const { data, poolings = {}, poolSets: providedPoolSets } = props

  const [poolingsArray, dispatchPoolings] = useReducer(
    updatePoolings,
    poolings,
    initial => updatePoolings([], { action: 'set', poolings: initial })
  )

  const { pooledData, poolSets } = useMemo(() => {
    const poolSets =
      providedPoolSets ||
      poolingsArray.map((pooling, index) => {
        const { scaleType, mapData } = pooling
        const ticksCount =
          typeof pooling.poolsCount === 'number'
            ? pooling.poolsCount
            : undefined

        return getTicks({
          data,
          ticksCount,
          scaleType,
          mapData,
        })
      })
    const pooledData = poolData(data, poolSets, poolingsArray, 0)

    return {
      pooledData,
      poolSets,
    }
  }, [data, poolingsArray, providedPoolSets])

  return {
    dispatchPoolings,
    pooledData,
    poolSets,
  }
}

const poolingShape = T.shape({
  mapData: T.func,
  poolsCount: T.number,
  scaleType: T.string,
})

usePooledData.propTypes = {
  data: T.array.isRequired,
  poolings: T.oneOfType([T.arrayOf(poolingShape), poolingShape]),
  poolSets: T.array,
}

export default usePooledData
