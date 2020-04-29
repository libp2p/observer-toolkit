import React, { useEffect } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import SlidingRow from './SlidingRow'

const Container = styled.div`
  position: absolute;
  width: 100%;
  pointer-events: none;
  top: ${({ rowHeight }) => rowHeight}px;
`

function getYOffset(rowIndex, rowHeight, firstIndex) {
  return (rowIndex - firstIndex) * rowHeight
}

function getYFromTo(rowContent, previousAllContent, rowHeight, firstIndex) {
  const previousRow = previousAllContent.find(row => row.key === rowContent.key)
  const yFrom = getYOffset(previousRow.index, rowHeight, firstIndex)
  const yTo = getYOffset(rowContent.index, rowHeight, firstIndex)
  return { yFrom, yTo }
}

function SlidingRows({
  columnDefs,
  slidingRowsRef,
  slidingRowsByType,
  slideDuration,
  rowHeight,
  firstIndex,
  override = {},
}) {
  const {
    disappearingRows,
    slidingOutRows,
    previousAllContent,
  } = slidingRowsByType

  useEffect(() => {
    slidingRowsRef.current.style.display = 'block'
    // Clear sliders once transition is complete
    const resetTimer = setTimeout(() => {
      slidingRowsRef.current.style.display = 'none'
    }, slideDuration)

    return () => {
      if (slidingRowsRef.current) {
        slidingRowsRef.current.style.display = 'none'
      }
      clearTimeout(resetTimer)
    }
  }, [slidingRowsRef, slideDuration])

  return (
    <Container rowHeight={rowHeight} ref={slidingRowsRef}>
      {disappearingRows.map(rowContent => {
        const yOffset = getYOffset(rowContent.index, rowHeight, firstIndex)
        return (
          <SlidingRow
            key={`disappear_${rowContent.key}`}
            columnDefs={columnDefs}
            rowContent={rowContent}
            yFrom={yOffset}
            yTo={yOffset}
            fadeOut={true}
            slideDuration={slideDuration}
            rowHeight={rowHeight}
          />
        )
      })}
      {slidingOutRows.map(rowContent => {
        const { yFrom, yTo } = getYFromTo(
          rowContent,
          previousAllContent,
          rowHeight,
          firstIndex
        )
        return (
          <SlidingRow
            key={`slide_${rowContent.key}`}
            columnDefs={columnDefs}
            rowContent={rowContent}
            yFrom={yFrom}
            yTo={yTo}
            fadeOut={true}
            slideDuration={slideDuration}
            rowHeight={rowHeight}
          />
        )
      })}
    </Container>
  )
}

SlidingRows.propTypes = {
  columnDefs: T.array.isRequired,
  slidingRowsRef: T.object.isRequired,
  slidingRowsByType: T.object.isRequired,
  slideDuration: T.number.isRequired,
  rowHeight: T.number,
  firstIndex: T.number,
  override: T.object,
}

export default SlidingRows
