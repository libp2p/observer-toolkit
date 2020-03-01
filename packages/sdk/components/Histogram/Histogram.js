import React, {
  useCallback,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import CanvasCover from '../CanvasCover'
import { getTicks } from '../../utils'
import paintGrid from './paintGrid'
import paintBars from './paintBars'

const mapLength = arr => arr.length

function Histogram({ pooledData, poolSets, unit, verticalLines = 8, theme }) {
  const [previousData, setPreviousData] = useState({
    pooledData,
    poolSets,
  })

  const onAnimationComplete = () => {
    setPreviousData({
      pooledData,
      poolSets,
    })
  }

  const counts = pooledData.map(mapLength)
  const previousCounts = previousData.pooledData.map(mapLength)

  const animateCanvas = useCallback(
    ({ canvasContext, canvasElem, width, height, animationRef }) => {
      return ({ tweenPosition }) => {
        let continueAnimation = true
        if (tweenPosition === 1) {
          onAnimationComplete()
          continueAnimation = false
        }
        if (
          previousData.pooledData === pooledData &&
          previousData.poolSets === poolSets
        ) {
          continueAnimation = false
        }

        canvasContext.clearRect(0, 0, width, height)

        const ticksProps = { min: 0, ticksCount: verticalLines }

        const yTicks = getTicks({ data: counts, ...ticksProps })
        const previousYTicks = getTicks({ data: previousCounts, ...ticksProps })

        const paintProps = {
          canvasContext,
          width,
          height,
          tweenPosition,
          theme,
        }
        const { cellWidth, cellHeight } = paintGrid({
          pools: poolSets[0],
          previousPools: previousData.poolSets[0],
          yTicks,
          previousYTicks,
          ...paintProps,
        })

        paintBars({
          counts,
          previousCounts,
          cellWidth,
          cellHeight,
          ...paintProps,
        })

        return continueAnimation
      }
    },
    [pooledData, poolSets, previousData]
  )
  return <CanvasCover animateCanvas={animateCanvas} animationDuration={500} />
}

Histogram.propTypes = {
  pooledData: T.array,
  poolSets: T.array,
  unit: T.string,
}

export default withTheme(Histogram)
