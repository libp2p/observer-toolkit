import React, {
  useCallback,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import { SetterContext } from '../context'
import CanvasCover from '../CanvasCover'
import { getTicks } from '../../utils'
import paintGrid from './paintGrid'
import paintBars from './paintBars'

const mapLength = arr => arr.length

function Histogram({
  pooledData,
  poolSets,
  unit,
  verticalLines = 8,
  xAxisSpace = 20,
  yAxisSpace = 4,
  theme,
}) {
  const [previousData, setPreviousData] = useState({
    pooledData,
    poolSets,
  })
  const { setPeerIds } = useContext(SetterContext)

  const hotSpotsRef = useRef([])

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

        const hotSpots = []
        hotSpots.defaultAction = () => setPeerIds([])

        canvasContext.clearRect(0, 0, width, height)

        const ticksProps = { min: 0, ticksCount: verticalLines }

        const yTicks = getTicks({ data: counts, ...ticksProps }).filter(
          tickNum => !(tickNum % 1)
        )
        const previousYTicks = getTicks({ data: previousCounts, ...ticksProps })

        const paintProps = {
          canvasContext,
          width,
          height,
          tweenPosition,
          xAxisSpace,
          yAxisSpace,
          theme,
        }
        const { cellWidth, cellHeight, countPerCell } = paintGrid({
          pools: poolSets[0],
          previousPools: previousData.poolSets[0],
          yTicks,
          previousYTicks,
          ...paintProps,
        })

        // TODO: un-hardcode the expectation of peer IDs
        const actions = pooledData.map(arr => () => {
          setPeerIds(arr.map(item => item.peerId))
        })

        paintBars({
          counts,
          previousCounts,
          cellWidth,
          cellHeight,
          hotSpots,
          actions,
          countPerCell,
          ...paintProps,
        })

        hotSpotsRef.current = hotSpots

        return continueAnimation
      }
    },
    [pooledData, poolSets, previousData]
  )
  return (
    <CanvasCover
      animateCanvas={animateCanvas}
      animationDuration={400}
      hotSpotsRef={hotSpotsRef}
    />
  )
}

Histogram.propTypes = {
  pooledData: T.array,
  poolSets: T.array,
  unit: T.string,
}

export default withTheme(Histogram)
