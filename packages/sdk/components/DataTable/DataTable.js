import React from 'react'
import T from 'prop-types'

import DataTableRow from './DataTableRow'
import DataTableHead from './DataTableHead'
import { Table } from './styledTable'

function DataTable({
  tableContentProps,
  columnDefs,
  TableRow = DataTableRow,
  TableHead = DataTableHead,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
}) {
  return (
    <Table>
      <thead>
        <tr>
          {columnDefs.map((columnDef, cellIndex) => (
            <TableHead
              key={columnDef.name}
              columnDef={columnDef}
              cellIndex={cellIndex}
              sortColumn={sortColumn}
              setSortColumn={setSortColumn}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              // filters={filters}
              // setFilters={setFilters}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {tableContentProps.map((rowContentProps, rowIndex) => (
          <TableRow
            key={`row_${rowIndex}`}
            rowContentProps={rowContentProps}
            columnDefs={columnDefs}
          ></TableRow>
        ))}
      </tbody>
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
}

export default DataTable
