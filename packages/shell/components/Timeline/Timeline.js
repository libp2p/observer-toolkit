import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { withResizeDetector } from 'react-resize-detector'

import { useStackedData, getNumericSorter } from '@libp2p-observer/sdk'

import { getTrafficChangesByPeer, getTotalTraffic, getPeerIds } from './utils'
import TimelinePaths from './TimelinePaths'
import TimeSlider from './TimeSlider'

const Container = styled.div`
  background: ${({ theme }) => theme.color('contrast')};
  position: relative;
  padding: ${({ theme }) => theme.spacing()} 0;
  color: ${({ theme }) => theme.color('text', 2)};
  user-select: none;
  margin-left: ${({ leftGutter }) => leftGutter};
`

const PathsContainer = styled.div`
  position: relative;
  user-select: none;
`

function Timeline({ width, leftGutter }) {
  const { stackedData, xScale, yScale: yScaleIn } = useStackedData({
    keyData: getTrafficChangesByPeer('in'),
    getKeys: getPeerIds,
    getSorter: getNumericSorter,
    mapSorter: getTotalTraffic,
  })

  const { stackedData: stackedDataOut, yScale: yScaleOut } = useStackedData({
    keyData: getTrafficChangesByPeer('out'),
    getKeys: getPeerIds,
    getSorter: getNumericSorter,
    mapSorter: getTotalTraffic,
  })

  // Make sure both data in and out use the same scale
  const yScaleInMax = yScaleIn.domain()[1]
  const yScaleOutMax = yScaleOut.domain()[1]
  const yScale = yScaleInMax > yScaleOutMax ? yScaleIn : yScaleOut

  // Extend the yScale so that 3 tick labels fit nicely
  yScale.nice(3)

  return (
    <Container leftGutter={leftGutter}>
      <PathsContainer>
        <TimelinePaths
          dataDirection="in"
          width={width}
          colorKey="primary"
          stackedData={stackedData}
          xScale={xScale}
          yScale={yScale}
          leftGutter={leftGutter}
        />
      </PathsContainer>
      <PathsContainer>
        <TimelinePaths
          dataDirection="out"
          width={width}
          colorKey="secondary"
          stackedData={stackedDataOut}
          xScale={xScale}
          yScale={yScale}
          leftGutter={leftGutter}
        />
      </PathsContainer>
      <TimeSlider width={width} />
    </Container>
  )
}

Timeline.propTypes = {
  width: T.number.isRequired, // Set by withResizeDetector
  leftGutter: T.number.isRequired,
}

export default withResizeDetector(Timeline)
