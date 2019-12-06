import { useContext, useMemo } from 'react'

import useSorter from '../hooks/useSorter'
import useFilter from '../hooks/useFilter'
import { DataContext } from '../components/context/DataProvider'

import { scaleLinear, scaleTime, stack } from 'd3'

import { validateNumbers } from '../utils/helpers'

function getMaxAreaPeak(stackedData) {
  return stackedData.reduce(
    (maxOverall, timeDatum) =>
      Math.max(
        maxOverall,
        timeDatum.reduce(
          (maxHere, [, upperAreaPoint]) => Math.max(maxHere, upperAreaPoint),
          0
        )
      ),
    0
  )
}

function getKeyedData(dataset, sorter, applyFilters, getKeys, keyData) {
  const keys = getKeys(dataset, sorter, applyFilters)

  // Returns array of objects with a numeric value for each key
  // and a property for the x-axis value.
  const keyedData = keyData(dataset, keys)

  return { keys, keyedData }
}

function stackData(keyedData, keys) {
  const dataStacker = stack().keys(keys)

  const stackedData = dataStacker(keyedData)

  const maxY = getMaxAreaPeak(stackedData)

  // Assumes all stacked data will be by timepoint - if not will need more options
  const xScale = scaleTime()
  // Scaling from dataset[0] leaves a gap of the width of 1 datapoint
  const minX = keyedData[0].time
  const maxX = keyedData[keyedData.length - 1].time

  const yScale = scaleLinear()

  validateNumbers({
    maxY,
    minX,
    maxX,
  })

  xScale.domain([minX, maxX])
  yScale.domain([0, maxY])

  return {
    stackedData,
    xScale,
    yScale,
  }
}

function useStackedData({
  getKeys,
  keyData,
  getSorter,
  mapSorter,
  defaultDirection = '',
}) {
  const dataset = useContext(DataContext)

  const { sorter, setSortDirection } = useSorter({
    getSorter,
    mapSorter: mapSorter,
    defaultDirection: 'desc',
  })

  const { applyFilters, dispatchFilters } = useFilter([])

  const { keys, keyedData } = useMemo(
    () => getKeyedData(dataset, sorter, applyFilters, getKeys, keyData),
    [dataset, sorter, applyFilters, getKeys, keyData]
  )

  // If we need to optimise this further for live data, can compare new data to
  // max peak, key new datapoints individually and append if it's not greater than the peak
  const { stackedData, xScale, yScale } = useMemo(
    () => stackData(keyedData, keys),
    [keyedData, keys]
  )

  return {
    stackedData,
    xScale,
    yScale,
    setSortDirection,
    dispatchFilters,
  }
}

useStackedData.propTypes = {}

export default useStackedData
