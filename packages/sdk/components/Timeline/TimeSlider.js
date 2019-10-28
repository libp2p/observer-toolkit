import React, { useContext, useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  DataContext,
  SetterContext,
  TimeContext,
} from '../context/DataProvider'

const Container = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
`
const BeforeTime = styled.div`
  height: 100%;
`
const TimeMarker = styled.div`
  position: absolute;
  background-color: ${({ theme }) => theme.color('tertiary', 'mid', 0.3)};
  width: ${({ width }) => width}px;
  border-left: 2px solid ${({ theme }) => theme.color('tertiary', 'mid', 0.2)};
  border-right: 2px solid ${({ theme }) => theme.color('tertiary', 'mid', 0.2)};
  height: 100%;
  cursor: col-resize;
`
const AfterTime = styled.div`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.color('dark', 'dark', 0.8)};
`

function TimeSlider({ width }) {
  const dataset = useContext(DataContext)
  const timepoint = useContext(TimeContext)
  const { setTimepoint } = useContext(SetterContext)

  const timeIndex = dataset.indexOf(timepoint)
  const [decimal, setDecimal] = useState((timeIndex + 1) / dataset.length)
  const [isSliding, setIsSliding] = useState(false)
  const containerRef = useRef()

  const widthPerTime = width / dataset.length

  if (!dataset.length || !timepoint) return ''

  const getSnapped = decimal => {
    const nearestIndex = Math.floor(dataset.length * decimal)
    const snappedDecimal = Math.min(1, (nearestIndex + 1) / dataset.length)

    return {
      snappedDecimal,
      nearestIndex,
    }
  }

  const slideStart = event => {
    setIsSliding(true)
    handleMouseMove(event)
  }
  const slideEnd = () => {
    if (!isSliding) return
    setIsSliding(false)

    // Handle in next tick
    setTimeout(() => {
      const { nearestIndex } = getSnapped(decimal)

      if (timeIndex !== nearestIndex) setTimepoint(dataset[nearestIndex])
    }, 50)
  }
  const handleMouseMove = e => {
    if (!isSliding) return
    const mouseX = e.nativeEvent.clientX - containerRef.current.offsetLeft

    const { snappedDecimal } = getSnapped(mouseX / width)
    setDecimal(snappedDecimal)
  }

  const timeMarkerLeft = `calc(${Math.round(decimal * 100) +
    '%'} - ${widthPerTime}px)`

  return (
    <Container
      onMouseDown={slideStart}
      onMouseUp={slideEnd}
      onMouseLeave={slideEnd}
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <BeforeTime style={{ width: Math.round(decimal * 100) + '%' }} />
      <TimeMarker style={{ left: timeMarkerLeft }} width={widthPerTime} />
      <AfterTime />
    </Container>
  )
}

TimeSlider.propTypes = {
  width: T.number,
}

export default TimeSlider
