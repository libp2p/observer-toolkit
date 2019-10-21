import React, { useMemo, useState } from 'react'
import T from 'prop-types'

import DataTableRow from './DataTableRow'
import DataTableHead from './DataTableHead'
import { Table } from './styledTable'

function prepareRows(rows, columns, sortBy, filters, sortDirection) {
  const filteredRows = filters
    ? rows.filter(
        row => !filters.some(({ filter, colIndex }) => !filter(row, colIndex))
      )
    : // If no filters, clone array so we don't mutate original
      [...rows]

  if (typeof sortBy === 'number') {
    const column = columns[sortBy]
    const sorter = column.sort(sortDirection, sortBy, column.sortKey)
    filteredRows.sort(sorter)
  }

  return filteredRows
}

function DataTable({
  rows,
  columns,
  TableRow = DataTableRow,
  TableHead = DataTableHead,
  defaultSortBy = null,
  defaultFilters = [],
  defaultSortDirection = 'asc',
}) {
  const [sortBy, setSortBy] = useState(defaultSortBy)
  const [sortDirection, setSortDirection] = useState(defaultSortDirection)
  const [filters, setFilters] = useState(defaultFilters)

  const preparedRows = useMemo(
    () => prepareRows(rows, columns, sortBy, filters, sortDirection),
    [rows, columns, sortBy, filters, sortDirection]
  )

  return (
    <Table>
      <thead>
        <tr>
          {columns.map((column, cellIndex) => (
            <TableHead
              key={column.name}
              column={column}
              cellIndex={cellIndex}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              defaultSortDirection={defaultSortDirection}
              filters={filters}
              setFilters={setFilters}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {preparedRows.map((row, rowIndex) => (
          <TableRow key={`row_${rowIndex}`} row={row} columns={columns} />
        ))}
      </tbody>
    </Table>
  )
}

DataTable.propTypes = {
  rows: T.array.isRequired,
  columns: T.array.isRequired,
  TableRow: T.any,
  TableHead: T.any,
  defaultSortBy: T.number,
  defaultFilters: T.array,
  defaultSortDirection: T.string,
}

export default DataTable
