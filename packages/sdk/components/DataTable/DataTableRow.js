import React, { useEffect, useMemo, useRef } from 'react'
import T from 'prop-types'
import styled, { css } from 'styled-components'

import { TableRow, TableCell } from './styledTable'

const FadeableTableRow = styled(TableRow)`
  ${({ theme, fadeIn }) =>
    fadeIn
      ? css`
          animation: 500ms ease-in 1 ${theme.keyframes.fadeIn};
        `
      : ''}
`

function DataTableRow({
  rowContent,
  columnDefs,
  fadeIn = false,
  children,
  yFrom,
  override = {},
  ...rowProps
}) {
  const rowRef = useRef()

  // Don't re-render all cells (often expensive) when only row props change
  const prerenderedCells = useMemo(
    () => (
      <>
        {columnDefs.map(
          ({ renderContent, align, name, cellProps = {} }, cellIndex) => {
            return (
              <TableCell align={align} key={name} {...cellProps}>
                {renderContent(rowContent[cellIndex])}
              </TableCell>
            )
          }
        )}
        {children}
      </>
    ),
    [columnDefs, children, rowContent]
  )

  useEffect(() => {
    if (rowRef.current && yFrom) {
      rowRef.current.style.transition = ''
      rowRef.current.style.transform = `translateY(${yFrom}px)`
      setTimeout(() => {
        if (!rowRef.current) return
        rowRef.current.style.transition = '500ms transform ease-in'
        rowRef.current.style.transform = ''
      })
    }
  }, [rowRef, yFrom])

  return (
    <FadeableTableRow
      fadeIn={fadeIn}
      ref={rowRef}
      data-rowkey={rowContent.key}
      as={override.TableRow}
      {...rowProps}
    >
      {prerenderedCells}
    </FadeableTableRow>
  )
}

DataTableRow.propTypes = {
  rowContent: T.array.isRequired,
  columnDefs: T.array.isRequired,
  fadeIn: T.bool,
  yFrom: T.number,
  children: T.node,
  override: T.object,
}

export default DataTableRow
