import { buildQueries, getAllByRole } from '@testing-library/react'

import {
  getColumnIndexes,
  getMatchingCells,
  getTable,
  getTableParts,
} from './helpers'

const queryAllByTableColumn = (
  container,
  column,
  table = getTable(container)
) => {
  const { thead, tbody, columnHeaders, rows } = getTableParts(table)

  const [columnIndex] = getColumnIndexes(thead, column, columnHeaders)

  if (typeof columnIndex !== 'number') {
    throw new Error(
      `None of table's ${columnHeaders.length} columns matches ${column}`
    )
  }

  const cells = getMatchingCells(
    tbody,
    columnIndex,
    getAllByRole(container, 'cell')
  )

  return cells
}

const getMultipleError = (_, matcher) => {
  throw new Error(`Multiple table cells found for matcher: ${matcher}`)
}
const getMissingError = (_, matcher) => {
  throw new Error(`No table cells found for matcher: ${matcher}`)
}

const [
  queryByTableColumn,
  getAllByTableColumn,
  getByTableColumn,
  findAllByTableColumn,
  findByTableColumn,
] = buildQueries(queryAllByTableColumn, getMultipleError, getMissingError)

export {
  queryByTableColumn,
  queryAllByTableColumn,
  getByTableColumn,
  getAllByTableColumn,
  findAllByTableColumn,
  findByTableColumn,
}
