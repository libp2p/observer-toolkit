import { useContext, useMemo } from 'react'
import T from 'prop-types'

import {
  DataContext,
  TimeContext,
  RuntimeContext,
} from '../components/context/DataProvider'
import { FilterContext } from '../components/context/FilterProvider'

function useCalculation(doCalculation, deps) {
  // Do an expensive calculation on latest context data and cache the result in a memo
  const dataset = useContext(DataContext)
  const timepoint = useContext(TimeContext)
  const runtime = useContext(RuntimeContext)
  const { filters, applyFilters } = useContext(FilterContext)

  let calcProps = {}

  // Let the caller tell us which hooks should cause the memoised function to rerun
  if (deps.includes('dataset')) calcProps = { dataset, ...calcProps }
  if (deps.includes('timepoint')) calcProps = { timepoint, ...calcProps }
  if (deps.includes('runtime')) calcProps = { runtime, ...calcProps }
  if (deps.includes('filters'))
    calcProps = { filters, applyFilters, ...calcProps }

  const value = useMemo(() => doCalculation(calcProps), [
    calcProps,
    doCalculation,
  ])

  return value
}

useCalculation.propTypes = {
  doCalculation: T.func.isRequired,
  deps: T.arrayOf([T.string]).isRequired,
}

export default useCalculation
