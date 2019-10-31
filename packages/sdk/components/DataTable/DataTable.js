import React from 'react'
import T from 'prop-types'

import DefaultDataTableRow from './DataTableRow'
import DefaultDataTableHead from './DataTableHead'
import { Table, THead, THeadRow, TBody } from './styledTable'

function DataTable({
  tableContentProps,
  columnDefs,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
  override = {},
}) {
  const DataTableRow = override.DataTableRow || DefaultDataTableRow
  const DataTableHead = override.DataTableHead || DefaultDataTableHead
  return (
    <Table as={override.TableHead}>
      <THead as={override.THead}>
        <THeadRow as={override.THeadRow}>
          {columnDefs.map((columnDef, cellIndex) => (
            <DataTableHead
              key={columnDef.name}
              columnDef={columnDef}
              cellIndex={cellIndex}
              sortColumn={sortColumn}
              setSortColumn={setSortColumn}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
            />
          ))}
        </THeadRow>
      </THead>
      <TBody as={override.TBody}>
        {tableContentProps.map((rowContentProps, rowIndex) => (
          <DataTableRow
            key={`row_${rowIndex}`}
            rowContentProps={rowContentProps}
            columnDefs={columnDefs}
          />
        ))}
      </TBody>
    </Table>
  )
}

DataTable.propTypes = {
  tableContentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
  TableRow: T.any,
  TableHead: T.any,
  sortColumn: T.string,
  setSortColumn: T.func,
  sortDirection: T.string,
  setSortDirection: T.func,
  override: T.object,
}

export default DataTable
