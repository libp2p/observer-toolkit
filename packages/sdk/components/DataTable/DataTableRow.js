import React, { useEffect, useMemo, useRef } from 'react'
import T from 'prop-types'

import { TableRow, TableCell } from './styledTable'

function DataTableRow({
  rowContent,
  columnDefs,
  hideUntil = null,
  fadeIn = false,
  children,
  ...rowProps
}) {
  const rowRef = useRef()

  // Don't re-render all cells (often expensive) when only row props change
  const prerenderedCells = useMemo(
    () => (
      <>
        {columnDefs.map(
          ({ renderContent, align, name, cellProps = {} }, cellIndex) => {
            return (
              <TableCell align={align} key={name} {...cellProps}>
                {renderContent(rowContent[cellIndex])}
              </TableCell>
            )
          }
        )}
        {children}
      </>
    ),
    [columnDefs, children, rowContent]
  )

  useEffect(() => {
    let timeout
    if (hideUntil && rowRef.current) {
      rowRef.current.style.transition = ''
      rowRef.current.style.visibility = 'hidden'
      timeout = setTimeout(() => {
        if (fadeIn) {
          rowRef.current.style.transition = `${hideUntil}ms opacity ease-in`
        }
        rowRef.current.style.visibility = 'visible'
      }, hideUntil)
    }
    return () => timeout && clearTimeout(timeout)
  }, [rowRef, hideUntil, fadeIn])

  return (
    <TableRow ref={rowRef} data-rowkey={rowContent.key} {...rowProps}>
      {prerenderedCells}
    </TableRow>
  )
}

DataTableRow.propTypes = {
  rowContent: T.array.isRequired,
  columnDefs: T.array.isRequired,
  hideUntil: T.number,
  fadeIn: T.bool,
  children: T.node,
}

export default DataTableRow
