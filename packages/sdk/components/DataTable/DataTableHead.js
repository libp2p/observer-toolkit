import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { TableHead } from './styledTable'
import Icon from '../Icon'

const IconContainer = styled.span`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  display: inline-block;
  vertical-align: middle;
  margin-left: ${({ theme }) => theme.spacing(0.5)};
  ${({ theme, hover }) =>
    hover ? `color: ${theme.color('secondary', 0)};` : ''}
  ${({ theme, isSorted }) =>
    isSorted && theme.transition({ property: 'transform' })}
  transform: rotate(${({ rotation }) => rotation}deg);
`
const TableHeadInner = styled.div`
  ${({ isSortable, theme, hover }) =>
    isSortable
      ? `
    cursor: pointer;
    ${
      hover
        ? `
      color: ${theme.color('text', 1)};
    `
        : ''
    }
  `
      : ''}
`

function flip(sortDirection) {
  return sortDirection === 'asc' ? 'desc' : 'asc'
}

const iconSize = '2em'

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

  const defaultSortDirection = columnDef.sort.defaultDirection
  const sortDirectionOnClick =
    isSortable && (isSorted ? flip(sortDirection) : defaultSortDirection)
  const sortIconType = (isSortable && hover) || isSorted ? 'back' : null
  const sortIconDirection = hover ? sortDirectionOnClick : sortDirection
  const sortIconRotation = sortIconDirection === 'asc' ? 90 : 270

  const sortIconAction = () => {
    setHover(false)
    if (!isSorted) setSortColumn(columnDef.name)
    setSortDirection(sortDirectionOnClick)
  }
  const hoverIn = () => setHover(true)
  const hoverOut = () => setHover(false)

  return (
    <TableHead
      key={columnDef.name}
      sortDirection={isSorted ? sortDirection : null}
      onClick={isSortable ? () => sortIconAction() : null}
      align={columnDef.align}
      {...props}
    >
      <TableHeadInner
        isSortable={isSortable}
        hover={hover}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        {columnDef.header}
        <IconContainer
          hover={hover}
          rotation={sortIconRotation}
          isSorted={isSorted}
          size={iconSize}
        >
          <Icon type={sortIconType} size={iconSize} />
        </IconContainer>
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
