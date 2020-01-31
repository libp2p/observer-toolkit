import React, { useEffect, useRef } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Table, TBody } from './styledTable'

const Container = styled.div.attrs(
  ({ theme, from, to, rowWidth, stepsMoved }) => {
    const shadowCol = theme.color('contrast', 0, Math.min(0.6, stepsMoved / 40))
    const shadowYOffset = Math.round(2 + Math.sqrt(stepsMoved))
    const shadowSpread = shadowYOffset * 3
    const boxShadow = `${shadowCol} 0 ${shadowYOffset}px ${shadowSpread}px`

    return {
      style: {
        top: `${from}px`,
        width: `${rowWidth}px`,
        zIndex: stepsMoved + 1,
        boxShadow,
      },
    }
  }
)`
  background: ${({ theme }) => theme.color('background', 0, 0.9)};
  position: absolute;
  width: 100%;
  ${({ theme }) => theme.boxShadow()}
  ${({ theme, slideDuration }) =>
    theme.transition({ duration: slideDuration / 1000, property: 'top' })}
`

function SlidingRow({
  rowRef,
  tbodyRef,
  previousRowIndex,
  rowIndex,
  slideDuration,
  Row,
  override = {},
}) {
  const slideRef = useRef()

  const rows = tbodyRef.current.querySelectorAll('tr')
  const toRow = rows.item(rowIndex)
  const fromRow = rows.item(previousRowIndex)

  let to, from, rowWidth, rowHeight
  if (toRow) {
    const { width, height } = toRow.getBoundingClientRect()
    to = toRow.offsetTop
    rowWidth = width
    rowHeight = height
  }
  if (fromRow) {
    const { width, height } = fromRow.getBoundingClientRect()
    from = fromRow.offsetTop
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
      slideDuration={slideDuration}
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
