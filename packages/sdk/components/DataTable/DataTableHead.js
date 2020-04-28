import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { TableHead } from './styledTable'
import SortIcon from './SortIcon'

const TableHeadInner = styled.div`
  ${({ isSortable, theme, hover }) =>
    !isSortable
      ? ''
      : `
    cursor: pointer;
    ${hover ? `color: ${theme.color('text', 1)};` : ''}
  `}
`

function flip(sortDirection) {
  return sortDirection === 'asc' ? 'desc' : 'asc'
}

function DataTableHead({
  columnDef,
  cellIndex,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
  sticky,
  override = {},
}) {
  const [hover, setHover] = useState(false)
  const isSortable = !!columnDef.sort
  const isSorted = isSortable && sortColumn === columnDef.name
  const defaultSortDirection = !isSortable
    ? null
    : columnDef.sort.defaultDirection
  const sortDirectionOnClick = isSorted
    ? flip(sortDirection)
    : defaultSortDirection
  const sortIconAction = !isSortable
    ? null
    : () => {
        setHover(false)
        if (!isSorted) setSortColumn(columnDef.name)
        setSortDirection(sortDirectionOnClick)
      }

  const hoverIn = () => setHover(true)
  const hoverOut = () => setHover(false)

  const colOverride = columnDef.override || override

  return (
    <TableHead
      key={columnDef.name}
      sortDirection={isSorted ? sortDirection : null}
      onClick={sortIconAction}
      align={columnDef.align}
      sticky={sticky}
      as={colOverride.TableHead}
      {...(columnDef.cellProps || {})}
    >
      <TableHeadInner
        isSortable={isSortable}
        hover={hover}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
        as={colOverride.TableHeadInner}
      >
        {columnDef.header}
        {isSortable && (
          <SortIcon
            hover={hover}
            isSorted={isSorted}
            columnDef={columnDef}
            sortDirection={sortDirection}
            sortDirectionOnClick={sortDirectionOnClick}
            override={colOverride}
          />
        )}
      </TableHeadInner>
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
  sticky: T.oneOfType([T.number, T.bool]),
  override: T.object,
}

export default DataTableHead
