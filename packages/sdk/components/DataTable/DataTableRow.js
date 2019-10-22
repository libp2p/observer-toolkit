import React from 'react'
import T from 'prop-types'

import { TableRow, TableCell } from './styledTable'

function DataTableRow({ rowContentProps, columnDefs, ...rowProps }) {
  return (
    <TableRow {...rowProps}>
      {columnDefs.map(({ renderContent, name, cellProps = {} }, cellIndex) => {
        return (
          <TableCell key={name} {...cellProps}>
            {renderContent(rowContentProps[cellIndex])}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

DataTableRow.propTypes = {
  rowContentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
}

export default DataTableRow
