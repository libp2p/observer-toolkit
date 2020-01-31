import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import T from 'prop-types'

import { TableRow, TableCell } from './styledTable'
import { SlidingRowSetterContext } from './context/SlidingRowProvider'

function getTopOffset(rowRef) {
  return rowRef.current ? rowRef.current.getBoundingClientRect().top : 0
}

function DataTableRow({
  rowIndex,
  tbodyRef,
  rowContentProps,
  columnDefs,
  slideDuration,
  children,
  ...rowProps
}) {
  const [previousRowIndex, setPreviousRowIndex] = useState(rowIndex)
  const dispatchSlidingRows = useContext(SlidingRowSetterContext)
  const rowRef = useRef()

  // Don't re-render all cells (often expensive) when only row props change
  const prerenderedCells = useMemo(
    () => (
      <>
        {columnDefs.map(
          ({ renderContent, align, name, cellProps = {} }, cellIndex) => {
            return (
              <TableCell align={align} key={name} {...cellProps}>
                {renderContent(rowContentProps[cellIndex])}
              </TableCell>
            )
          }
        )}
        {children}
      </>
    ),
    [columnDefs, children, rowContentProps]
  )

  useEffect(() => {
    if (rowIndex === previousRowIndex) return

    setPreviousRowIndex(rowIndex)
    dispatchSlidingRows({
      action: 'append',
      rowDef: {
        rowRef,
        previousRowIndex,
        rowIndex,
        Row: () => (
          <TableRow ref={rowRef} {...rowProps}>
            {prerenderedCells}
          </TableRow>
        ),
      },
    })
    if (tbodyRef.current) {
      const rows = tbodyRef.current.querySelectorAll('tr')
      const fromRow = rows.item(previousRowIndex)
      const toRow = rows.item(rowIndex)

      // Hide static rows during animation, which may be sliding to or
      // from a position beyond the last row in the last shown state
      if (fromRow) fromRow.style.visibility = 'hidden'
      if (toRow) toRow.style.visibility = 'hidden'

      setTimeout(() => {
        if (fromRow) fromRow.style.visibility = 'visible'
        if (toRow) toRow.style.visibility = 'visible'
      }, slideDuration)
    }
  })

  return (
    <TableRow ref={rowRef} {...rowProps}>
      {prerenderedCells}
    </TableRow>
  )
}

DataTableRow.propTypes = {
  rowContentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
  children: T.node,
}

export default DataTableRow
