import React from 'react'
import T from 'prop-types'

import DefaultDataTableRow from './DataTableRow'
import DefaultDataTableHead from './DataTableHead'
import { Table, THead, THeadRow, TBody } from './styledTable'

function DataTable({
  contentProps,
  columnDefs,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
  override = {},
}) {
  const DataTableRow = override.DataTableRow || DefaultDataTableRow
  const DataTableHead = override.DataTableHead || DefaultDataTableHead

  // Key rows by a unique identifying property if one is declared in column def
  const keyColumnIndex = columnDefs.findIndex(colDef => !!colDef.rowKey)
  const keyColumn = keyColumnIndex >= 0 && columnDefs[keyColumnIndex]
  const getRowKey = (rowContentProps, rowIndex) =>
    keyColumn
      ? rowContentProps[keyColumnIndex][keyColumn.rowKey]
      : `row_${rowIndex}`

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
        {contentProps.map((rowContentProps, rowIndex) => {
          const key = getRowKey(rowContentProps, rowIndex)
          return (
            <DataTableRow
              key={key}
              rowContentProps={rowContentProps}
              columnDefs={columnDefs}
            />
          )
        })}
      </TBody>
    </Table>
  )
}

DataTable.propTypes = {
  contentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
  columnMetadata: T.array,
  TableRow: T.any,
  TableHead: T.any,
  sortColumn: T.string,
  setSortColumn: T.func,
  sortDirection: T.string,
  setSortDirection: T.func,
  override: T.object,
}

export default DataTable
