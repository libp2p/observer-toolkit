import { getAllByRole, queryAllByRole, within } from '@testing-library/react'
import flatten from 'lodash.flatten'

function getTable(container) {
  const tableAbove = container.closest('table')
  if (tableAbove) return tableAbove

  // table could contain nested tables, so get all then look at first table only
  const tablesBelow = getAllByRole(container, 'table')
  if (tablesBelow.length) return tablesBelow[0]

  throw new Error('No tables above or below container in the DOM tree')
}

function getTableParts(table) {
  const thead = table.querySelector(':scope > thead')
  if (!thead) throw new Error('No <thead> found as a child of provided table')

  const tbody = table.querySelector(':scope > tbody')
  if (!tbody) throw new Error('No <tbody> found as a child of provided table')

  // Filter to exclude contents of nested tables
  const columnHeaders = getAllByRole(thead, 'columnheader').filter(
    th => th.closest('thead') === thead
  )
  const rows = getAllByRole(tbody, 'row').filter(
    tr => tr.closest('tbody') === tbody
  )

  return {
    thead,
    tbody,
    columnHeaders,
    rows,
  }
}

function getColumnIndexes(rowContainer, matcher, filteredCells) {
  // Returning null will not filter by index and match all
  if (matcher === null || matcher === undefined) return null

  if (typeof matcher === 'number') return [matcher]

  if (Array.isArray(matcher)) {
    return flatten(matcher.map(match => getColumnIndexes(match, filteredCells)))
  }

  const matches = getMatchingCells(rowContainer, matcher, filteredCells)

  if (!matches || !matches.length) return []
  return matches.map(match => filteredCells.findIndex(findChildOrSelf(match)))
}

/*
function hasMatchingCell(rowContainer, matcher, filteredCells) {
  return !!getMatches(matcher, filteredCells, rowContainer).length
}
*/

function getMatchingCells(rowContainer, matcher, filteredCells) {
  if (!filteredCells || !filteredCells.length) return []

  const ifNotExcluded = match => filteredCells.some(findChildOrSelf(match))

  const matchType = matcher instanceof RegExp ? 'RegExp' : typeof matcher
  switch (matchType) {
    case 'number': {
      const rows = queryAllByRole(rowContainer, 'row')
      const cells = rows.length
        ? rows.map(row => getCellByIndex(row, matcher))
        : [getCellByIndex(rowContainer, matcher)]
      return cells.filter(ifNotExcluded)
    }
    case 'function':
      return matcher(rowContainer, filteredCells).filter(ifNotExcluded)

    case 'string':
    case 'RegExp':
      return within(rowContainer)
        .queryAllByText(matcher)
        .filter(ifNotExcluded)

    default:
      throw new Error(`Invalid matcher type "${matchType}"`)
  }
}

function getCellByIndex(rowContainer, cellIndex) {
  const cells = queryAllByRole(rowContainer, 'cell')
  const cell =
    cellIndex < 0 ? cells[cells.length + cellIndex] : cells[cellIndex]
  return cell
}

function findChildOrSelf(innerNode) {
  // For cases where it's an implementation details whether a match was a child or not
  return outerNode => outerNode === innerNode || outerNode.contains(innerNode)
}

export {
  findChildOrSelf,
  getColumnIndexes,
  getMatchingCells,
  getTable,
  getTableParts,
}
