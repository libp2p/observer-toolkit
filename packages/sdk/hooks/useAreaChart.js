import { useMemo } from 'react'
import T from 'prop-types'
import { area } from 'd3'

function scaleAreaChart(height, width, xScale, yScale, flip) {
  xScale.range([0, width])
  yScale.range(flip ? [0, height] : [height, 0])

  const areaMaker = area()
    .x(d => xScale(d.data.time))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))

  return areaMaker
}

function getPathDefs(stackedData, areaMaker) {
  const pathDefs = stackedData.map(datum => ({
    pathDef: areaMaker(datum),
    key: datum.key,
  }))

  return pathDefs
}

function useAreaChart({
  height,
  width,
  stackedData,
  xScale,
  yScale,
  flip = false,
}) {
  // Both steps are potentially very expensive if applied to large,
  // rapidly changing data sets, so don't rescale unless needed

  const areaMaker = useMemo(
    () => scaleAreaChart(height, width, xScale, yScale, flip),
    [height, width, xScale, yScale, flip]
  )

  const pathDefs = useMemo(() => getPathDefs(stackedData, areaMaker), [
    stackedData,
    areaMaker,
  ])

  return pathDefs
}

useAreaChart.propTypes = {
  height: T.number.isRequired,
  width: T.number.isRequired,
  stackedData: T.array.isRequired,
  xScale: T.func.isRequired,
  yScale: T.func.isRequired,
}

export default useAreaChart
