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
  columnDef,
  cellIndex,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
  filters,
  setFilters,
  ...props
}) {
  const isSortable = !!columnDef.sort
  const isSorted = isSortable && sortColumn === columnDef.name

  const isFilterable = filters && !!columnDef.filter
  const isFiltered =
    isFilterable && filters.includes(({ colIndex }) => colIndex === cellIndex)

  const sortIconType = getSortType(isSortable, isSorted, sortDirection)

  const sortIconAction = () => {
    if (sortIconType === 'sort') {
      setSortColumn(columnDef.name)
      const defaultSortDirection = columnDef.sort.defaultDirection
      if (sortDirection !== defaultSortDirection)
        setSortDirection(defaultSortDirection)
      return
    }
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }
  const filterIconAction = cellIndex => {
    // TODO: implement an example filter
    setFilters(columnDef.filter())
  }

  return (
    <TableHead
      key={columnDef.name}
      sortable={isSortable}
      sortDirection={isSorted ? sortDirection : null}
      filterable={!!columnDef.filter}
      isFiltered={isFiltered}
      {...props}
    >
      {columnDef.header}
      {isSortable && (
        <>
          {NON_BREAKING_SPACE}
          <Icon
            type={sortIconType}
            active={sortIconType !== 'sort'}
            onClick={() => sortIconAction()}
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
  columnDef: T.object.isRequired,
  cellIndex: T.number.isRequired,
  sortColumn: T.string,
  setSortColumn: T.func,
  sortDirection: T.string,
  setSortDirection: T.func,
  filters: T.array,
  setFilters: T.func,
}

export default DataTableHead
