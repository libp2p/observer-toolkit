import { useContext, useMemo } from 'react'

import useSorter from '../hooks/useSorter'
import { FilterContext } from '../components/context/FilterProvider'
import { DataContext } from '../components/context/DataProvider'
import { getNumericSorter } from '../sorters'

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

function getKeyedData(
  dataset,
  xSorter,
  ySorter,
  applyFilters,
  getKeys,
  keyData
) {
  const keys = getKeys(dataset, ySorter, applyFilters)

  // Returns array of objects with a numeric value for each key
  // and a property for the x-axis value.
  const keyedData = keyData(dataset, keys)
  const from = performance.now()
  keyedData.sort(xSorter)
  console.log(performance.now() - from)
  return { keys, keyedData }
}

function stackData(keyedData, keys, xSorter) {
  const dataStacker = stack().keys(keys)

  const stackedData = dataStacker(keyedData)
  const xScale = scaleTime()
  const yScale = scaleLinear()

  if (keyedData.length) {
    const maxY = getMaxAreaPeak(stackedData)

    // Assumes all stacked data will be by timepoint - if not will need more options
    // Scaling from dataset[0] leaves a gap of the width of 1 datapoint
    const minX = keyedData[0].time
    const maxX = keyedData[keyedData.length - 1].time

    validateNumbers({
      maxY,
      minX,
      maxX,
    })

    xScale.domain([minX, maxX])
    yScale.domain([0, maxY])
  }

  return {
    stackedData,
    xScale,
    yScale,
  }
}

function useStackedData({
  getKeys,
  keyData,
  mapYSorter,
  getYSorter = getNumericSorter,
  defaultYSortDirection = 'desc',
  mapXSorter = d => d.time,
  getXSorter = getNumericSorter,
  defaultXSortDirection = 'asc',
}) {
  const dataset = useContext(DataContext)
  const { applyFilters } = useContext(FilterContext)

  const { sorter: xSorter, setSortDirection: setXSortDirection } = useSorter({
    getSorter: getXSorter,
    mapSorter: mapXSorter,
    defaultDirection: defaultXSortDirection,
  })

  const { sorter: ySorter, setSortDirection: setYSortDirection } = useSorter({
    getSorter: getYSorter,
    mapSorter: mapYSorter,
    defaultDirection: defaultYSortDirection,
  })

  const { keys, keyedData } = useMemo(
    () =>
      getKeyedData(dataset, xSorter, ySorter, applyFilters, getKeys, keyData),
    [dataset, xSorter, ySorter, applyFilters, getKeys, keyData]
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
    setXSortDirection,
    setYSortDirection,
  }
}

useStackedData.propTypes = {}

export default useStackedData
