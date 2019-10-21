import React from 'react'
import T from 'prop-types'

import { TableRow, TableCell } from './styledTable'

function DataTableRow({ row, columns, ...props }) {
  return (
    <TableRow {...props}>
      {row.map((cell, cellIndex) => {
        const column = columns[cellIndex]
        return (
          <TableCell
            key={column.name}
            cellProps={Object.assign({}, column.cellProps, cell.cellProps)}
          >
            {cell.content}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

DataTableRow.propTypes = {
  row: T.array.isRequired,
  columns: T.array.isRequired,
}

export default DataTableRow
