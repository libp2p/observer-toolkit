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

const Container = styled.div`
  position: relative;
  height: 90px;
`

const XAxisLabel = styled.div`
  height: 16px;
  text-align: center;
  ${({ theme }) => theme.text('label', 'medium')}
`

function Histogram({
  pooledData,
  poolSets,
  xAxisSuffix = '',
  verticalLines = 8,
  xAxisSpace = 20,
  yAxisSpace = 4,
  theme,
}) {
  const [previousData, setPreviousData] = useState({
    pooledData,
    poolSets,
  })
  const [highlightedArea, setHighlightedArea] = useState(null)
  const { setPeerIds } = useContext(SetterContext)

  const xAxisLabelRef = useRef()
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

        if (highlightedArea) {
          const fillCol = theme.color('background', 0)
          const strokeCol = theme.color('background', 2)
          canvasContext.fillStyle = fillCol
          canvasContext.strokeStyle = strokeCol
          canvasContext.fillRect(
            highlightedArea.area.x,
            highlightedArea.area.y,
            highlightedArea.area.width,
            highlightedArea.area.height
          )
        }

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
          countPerCell,
          ...paintProps,
        })

        hotSpotsRef.current = poolSets[0].map((pool, i) => {
          const upper = poolSets[0][i + 1]
          const label = !upper ? `>= ${pool}` : `${pool}-${upper}`
          const area = {
            x: xAxisSpace + cellWidth * i,
            y: 0,
            width: cellWidth,
            height: height,
          }

          const action = () => {
            actions[i] && actions[i]()
            setHighlightedArea({
              label: label + xAxisSuffix,
              area,
            })
          }
          return {
            action,
            area,
          }
        })

        return continueAnimation
      }
    },
    [pooledData, poolSets, previousData, highlightedArea]
  )

  const handleMouseOut = () => {
    setPeerIds([])
    setHighlightedArea(null)
  }
  return (
    <>
      <Container onMouseOut={handleMouseOut}>
        <CanvasCover
          animateCanvas={animateCanvas}
          animationDuration={400}
          hotSpotsRef={hotSpotsRef}
        />
      </Container>
      <XAxisLabel>{highlightedArea && highlightedArea.label}</XAxisLabel>
    </>
  )
}

Histogram.propTypes = {
  pooledData: T.array,
  poolSets: T.array,
  unit: T.string,
}

export default withTheme(Histogram)
