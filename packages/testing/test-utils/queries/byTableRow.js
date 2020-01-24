import {
  buildQueries,
  queryHelpers,
  queryAllByRole,
} from '@testing-library/react'

import { getColumnIndexes, getTable, getTableParts } from './helpers'

const queryAllByTableRow = (
  container,
  conditions,
  table = getTable(container)
) => {
  const { thead, tbody, columnHeaders, rows } = getTableParts(table)

  let filteredRows = rows
  for (const { column, numericContent, textContent } of conditions) {
    const columnIndexes = getColumnIndexes(thead, column, columnHeaders)

    if (textContent) {
      filterRows(filteredRows, columnIndexes, cell =>
        textContent(cell.textContent)
      )
    }
    if (numericContent) {
      filterRows(filteredRows, columnIndexes, cell =>
        numericContent(parseFloat(cell.textContent))
      )
    }
  }

  return filteredRows
}

function filterRows(rows, columnIndexes, testCell) {
  rows = rows.filter(row => testRow(row, columnIndexes, testCell))
}

function testRow(row, columnIndexes, testCell) {
  const rowCells = queryAllByRole(row, 'cell')
  const columnMatches = columnIndexes
    ? columnIndexes.map(i => rowCells[i])
    : rowCells
  return columnMatches.some(cell => testCell(cell))
}

const getMultipleError = element => {
  throw new Error('Multiple matching table rows found')
}
const getMissingError = element => {
  throw new Error('No matching table rows found')
}

const [
  queryByTableRow,
  getAllByTableRow,
  getByTableRow,
  findAllByTableRow,
  findByTableRow,
] = buildQueries(queryAllByTableRow, getMultipleError, getMissingError)

export {
  queryByTableRow,
  queryAllByTableRow,
  getByTableRow,
  getAllByTableRow,
  findAllByTableRow,
  findByTableRow,
}
