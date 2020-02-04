import React, { useContext, useEffect } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  SlidingRowContext,
  SlidingRowSetterContext,
} from './context/SlidingRowProvider'
import SlidingRow from './SlidingRow'

const Container = styled.div`
  position: absolute;
  width: 100%;
  pointer-events: none;
`

function SlidingRowsContainer({ tbodyRef, slideDuration, override = {} }) {
  const slidingRowDefs = useContext(SlidingRowContext)
  const dispatchSlidingRows = useContext(SlidingRowSetterContext)

  useEffect(() => {
    // Clear sliders once transition is complete
    const resetTimer = setTimeout(() => {
      if (slidingRowDefs.length) dispatchSlidingRows({ action: 'clear' })
    }, slideDuration)

    return () => clearTimeout(resetTimer)
  })

  if (!tbodyRef.current) return ''
  return (
    <Container>
      {slidingRowDefs.map(({ rowRef, previousRowIndex, rowIndex, Row }) => (
        <SlidingRow
          key={`slideFrom[${previousRowIndex}]To[${rowIndex}]`}
          rowRef={rowRef}
          tbodyRef={tbodyRef}
          previousRowIndex={previousRowIndex}
          rowIndex={rowIndex}
          Row={Row}
          slideDuration={slideDuration}
          override={override}
        />
      ))}
    </Container>
  )
}

SlidingRowsContainer.propTypes = {
  tbodyRef: T.object.isRequired,
  slideDuration: T.number.isRequired,
  override: T.object,
}

export default SlidingRowsContainer
