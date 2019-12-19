import React, { useMemo } from 'react'
import T from 'prop-types'

import { TableRow, TableCell } from './styledTable'

function DataTableRow({ rowContentProps, columnDefs, ...rowProps }) {
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
      </>
    ),
    [rowContentProps, columnDefs]
  )

  return <TableRow {...rowProps}>{prerenderedCells}</TableRow>
}

DataTableRow.propTypes = {
  rowContentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
}

export default DataTableRow
