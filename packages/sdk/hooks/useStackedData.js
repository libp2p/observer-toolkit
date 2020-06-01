import { useContext, useMemo } from 'react'
import T from 'prop-types'

import useSorter from '../hooks/useSorter'
import { FilterContext } from '../components/context/FilterProvider'
import { getNumericSorter } from '../sorters'

import { scaleLinear, scaleTime, stack } from 'd3'

import { validateNumbers } from '../utils/helpers'

function getMaxAreaPeak(stackedData) {
  return stackedData.reduce(
    (maxOverall, datum) =>
      Math.max(
        maxOverall,
        datum.reduce((maxInDatum, [y0, y1]) => Math.max(maxInDatum, y0, y1), 0)
      ),
    0
  )
}

function getKeyedData(data, xSorter, ySorter, applyFilters, getKeys, keyData) {
  const keys = getKeys(data, ySorter, applyFilters)

  // Returns array of objects with a numeric value for each key
  // and a property for the x-axis value.
  const keyedData = keyData(data, keys)
  keyedData.sort(xSorter)
  return { keys, keyedData }
}

function stackData(keyedData, keys, xSorter) {
  const dataStacker = stack().keys(keys)

  const stackedData = dataStacker(keyedData)
  const xScale = scaleTime()
  const yScale = scaleLinear()

  if (keyedData.length) {
    const maxY = getMaxAreaPeak(stackedData)

    const minX = keyedData[0].end
    const maxX = keyedData[keyedData.length - 1].end

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

function useStackedData(props) {
  T.checkPropTypes(useStackedData.propTypes, props, 'prop', 'useStackedData')
  const {
    data,
    getKeys,
    keyData,
    mapYSorter,
    getYSorter = getNumericSorter,
    defaultYSortDirection = 'desc',
    mapXSorter = d => d.end,
    getXSorter = getNumericSorter,
    defaultXSortDirection = 'asc',
  } = props

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
    () => getKeyedData(data, xSorter, ySorter, applyFilters, getKeys, keyData),
    [data, xSorter, ySorter, applyFilters, getKeys, keyData]
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
useStackedData.propTypes = {
  data: T.array.isRequired,
  getKeys: T.func.isRequired,
  keyData: T.func.isRequired,
  mapYSorter: T.func,
  getYSorter: T.func,
  defaultYSortDirection: T.string,
  mapXSorter: T.func,
  getXSorter: T.func,
  defaultXSortDirection: T.string,
}

export default useStackedData
