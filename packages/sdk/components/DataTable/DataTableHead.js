import React from 'react'
import T from 'prop-types'

import { TableHead } from './styledTable'
import Icon from '../Icon'

const NON_BREAKING_SPACE = '\u00A0'

function getSortType(isSortable, isSorted, sortDirection) {
  if (!isSortable) return null
  if (!isSorted) return 'sort'
  return sortDirection
}

function DataTableHead({
  column,
  cellIndex,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  defaultSortDirection,
  filters,
  setFilters,
  ...props
}) {
  const isSortable = !!column.sort
  const isSorted = isSortable && sortBy === cellIndex

  const isFilterable = !!column.filter
  const isFiltered =
    isFilterable && filters.includes(({ colIndex }) => colIndex === cellIndex)

  const sortIconType = getSortType(isSortable, isSorted, sortDirection)

  const sortIconAction = cellIndex => {
    if (sortIconType === 'sort') {
      setSortBy(cellIndex)
      if (sortDirection !== defaultSortDirection)
        setSortDirection(defaultSortDirection)
      return
    }
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }
  const filterIconAction = cellIndex => {
    // TODO: implement an example filter
    setFilters(column.filter())
  }

  return (
    <TableHead
      key={column.name}
      sortable={isSortable}
      sortDirection={isSorted ? sortDirection : null}
      filterable={!!column.filter}
      filter={filters.find(({ colIndex }) => colIndex === cellIndex)}
      {...props}
    >
      {column.content || column.name}
      {isSortable && (
        <>
          {NON_BREAKING_SPACE}
          <Icon
            type={sortIconType}
            active={sortIconType !== 'sort'}
            onClick={() => sortIconAction(cellIndex)}
            offset
          />
        </>
      )}
      {isFilterable && (
        <>
          {NON_BREAKING_SPACE}
          <Icon
            type="filter"
            active={isFiltered}
            onClick={() => filterIconAction(cellIndex)}
            offset
          />
        </>
      )}
    </TableHead>
  )
}

DataTableHead.propTypes = {
  column: T.object.isRequired,
  cellIndex: T.number.isRequired,
  sortBy: T.number,
  setSortBy: T.func.isRequired,
  sortDirection: T.string,
  setSortDirection: T.func.isRequired,
  defaultSortDirection: T.string.isRequired,
  filters: T.array,
  setFilters: T.func.isRequired,
}

export default DataTableHead
