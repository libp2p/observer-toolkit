import React, { useEffect, useRef } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Table, TBody } from './styledTable'

const Container = styled.div.attrs(({ from, to, rowWidth, stepsMoved }) => ({
  style: {
    top: `${from}px`,
    width: `${rowWidth}px`,
    zIndex: stepsMoved,
  },
}))`
  background: ${({ theme }) => theme.color('background', 0, 0.9)};
  position: absolute;
  width: 100%;
  ${({ theme }) => theme.boxShadow()}
  ${({ theme, transitionDuration }) =>
    theme.transition({ duration: transitionDuration, property: 'top' })}
`

function SlidingRow({
  rowRef,
  tbodyRef,
  previousRowIndex,
  rowIndex,
  transitionDuration,
  Row,
  override = {},
}) {
  const slideRef = useRef()

  const rows = tbodyRef.current.querySelectorAll('tr')
  const toRow = rows.item(rowIndex)
  const fromRow = rows.item(previousRowIndex)

  let to, from, rowWidth, rowHeight
  if (toRow) {
    const { top, width, height } = toRow.getBoundingClientRect()
    to = top
    rowWidth = width
    rowHeight = height
  }
  if (fromRow) {
    const { top, width, height } = fromRow.getBoundingClientRect()
    from = top
    rowWidth = width
    rowHeight = height
  }
  if (typeof from !== 'number') from = rowHeight * (previousRowIndex + 1)
  if (typeof to !== 'number') to = rowHeight * (rowIndex + 1)

  const stepsMoved = Math.abs(previousRowIndex - rowIndex)

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.top = `${to}px`
    }
  })

  return (
    <Container
      ref={slideRef}
      from={from}
      to={to}
      stepsMoved={stepsMoved}
      rowWidth={rowWidth}
      transitionDuration={transitionDuration}
      role="presentation"
    >
      <Table as={override.TableHead}>
        <TBody as={override.TBody}>
          <Row />
        </TBody>
      </Table>
    </Container>
  )
}

SlidingRow.propTypes = {
  rowRef: T.object.isRequired,
  previousRowIndex: T.number.isRequired,
  rowIndex: T.number.isRequired,
  Row: T.any.isRequired,
}

export default SlidingRow
