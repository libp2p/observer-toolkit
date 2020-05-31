import React, { forwardRef, useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { withResizeDetector } from 'react-resize-detector'

import { useStackedData, DataContext } from '@nearform/observer-sdk'

import {
  getTrafficChangesByConn,
  getTotalTraffic,
  getConnectionKeys,
} from './utils'
import TimelinePaths from './TimelinePaths'
import TimeSlider from './TimeSlider'

const Container = styled.div`
  background: ${({ theme }) => theme.color('contrast')};
  position: relative;
  padding: ${({ theme }) => theme.spacing()} 0;
  color: ${({ theme }) => theme.color('text', 3)};
  margin-left: ${({ leftGutter }) => leftGutter}px;
  height: 100%;
`

const TimelineInner = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: ${({ theme }) => theme.spacing()};
  left: 0;
`

const BarWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  ${({ onClick }) => onClick && 'cursor: pointer;'}
`
const PathsContainer = styled.div`
  position: relative;
  user-select: none;
`

function Timeline({ width = 700, leftGutter }) {
  const states = useContext(DataContext)

  const { stackedData, xScale, yScale: yScaleIn } = useStackedData({
    data: states,
    keyData: getTrafficChangesByConn('in'),
    getKeys: getConnectionKeys,
    mapYSorter: getTotalTraffic,
  })

  const { stackedData: stackedDataOut, yScale: yScaleOut } = useStackedData({
    data: states,
    keyData: getTrafficChangesByConn('out'),
    getKeys: getConnectionKeys,
    mapYSorter: getTotalTraffic,
  })

  // Make sure both data in and out use the same scale
  const yScaleInMax = yScaleIn.domain()[1]
  const yScaleOutMax = yScaleOut.domain()[1]
  const yScale = yScaleInMax > yScaleOutMax ? yScaleIn : yScaleOut

  // Extend the yScale so that 3 tick labels fit nicely
  yScale.nice(3)

  const innerWidth = width - leftGutter

  // Inject timeline graphic into slider bar so that both can be interacted with
  const Bar = forwardRef(({ controlWidth, onClick, children }, ref) => (
    <BarWrapper controlWidth={controlWidth} onClick={onClick} ref={ref}>
      <TimelineInner>
        <PathsContainer>
          <TimelinePaths
            dataDirection="in"
            width={innerWidth}
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
            width={innerWidth}
            colorKey="secondary"
            stackedData={stackedDataOut}
            xScale={xScale}
            yScale={yScale}
            leftGutter={leftGutter}
          />
        </PathsContainer>
      </TimelineInner>
      {children}
    </BarWrapper>
  ))
  Bar.propTypes = {
    controlWidth: T.number.isRequired,
    onClick: T.func.isRequired,
    children: T.node,
  }

  return (
    <Container leftGutter={leftGutter}>
      <TimeSlider width={innerWidth} override={{ Bar }} />
    </Container>
  )
}

Timeline.propTypes = {
  width: T.number, // Set by withResizeDetector
  leftGutter: T.number.isRequired,
}

export default withResizeDetector(Timeline)
