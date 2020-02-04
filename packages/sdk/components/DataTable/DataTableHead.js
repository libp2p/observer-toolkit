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
  ...props
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

  const override = columnDef.override || {}

  return (
    <TableHead
      key={columnDef.name}
      sortDirection={isSorted ? sortDirection : null}
      onClick={sortIconAction}
      align={columnDef.align}
      as={override.TableHead}
      {...props}
    >
      <TableHeadInner
        isSortable={isSortable}
        hover={hover}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
        as={override.TableHeadInner}
      >
        {columnDef.header}
        {isSortable && (
          <SortIcon
            hover={hover}
            isSorted={isSorted}
            columnDef={columnDef}
            sortDirection={sortDirection}
            sortDirectionOnClick={sortDirectionOnClick}
            override={override}
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
}

export default DataTableHead
