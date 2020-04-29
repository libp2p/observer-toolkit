import React, { useRef } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import SlidingRows from './SlidingRows'
import DefaultDataTableRow from './DataTableRow'
import DefaultDataTableHead from './DataTableHead'
import DataTablePagination from './DataTablePagination'
import { Table, THead, THeadRow, TBody } from './styledTable'
import useSlidingRows from './useSlidingRows'

const Container = styled.div`
  position: relative;
`

const HeaderRow = styled(THeadRow)`
  height: ${({ rowHeight }) => rowHeight}px;
`

const slideDuration = 400
const defaultRowHeight = 48

function getRowHeight(tbodyRef) {
  if (!tbodyRef.current) return defaultRowHeight
  const row = tbodyRef.current.querySelector('tr')
  return row ? row.getBoundingClientRect().height : defaultRowHeight
}

function DataTable({
  allContent,
  shownContent,
  columnDefs,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
  setRange,
  rowCounts = {},
  hasPagination = false,
  hasSlidingRows = true,
  rowHeight,
  rowsPerPageOptions,
  defaultPerPageIndex,
  sticky = true,
  rowProps = {},
  tbodyProps = {},
  override = {},
}) {
  const tbodyRef = useRef()
  const slidingRowsRef = useRef()

  if (!rowHeight) rowHeight = getRowHeight(tbodyRef)
  const firstIndex = rowCounts.showFrom

  const DataTableRow = override.DataTableRow || DefaultDataTableRow
  const DataTableHead = override.DataTableHead || DefaultDataTableHead

  const slidingRowsByType = useSlidingRows({
    disabled: !hasSlidingRows,
    allContent,
    shownContent,
    tbodyRef,
    slidingRowsRef,
    slideDuration,
    rowHeight,
    firstIndex,
  })

  return (
    <Container>
      {hasSlidingRows && (
        <SlidingRows
          columnDefs={columnDefs}
          slidingRowsRef={slidingRowsRef}
          slidingRowsByType={slidingRowsByType}
          rowHeight={rowHeight}
          firstIndex={firstIndex}
          slideDuration={slideDuration}
          override={override}
        />
      )}
      <Table as={override.Table}>
        <THead as={override.THead}>
          <HeaderRow rowHeight={rowHeight} as={override.HeaderRow}>
            {columnDefs.map((columnDef, cellIndex) => (
              <DataTableHead
                key={columnDef.name}
                columnDef={columnDef}
                cellIndex={cellIndex}
                sortColumn={sortColumn}
                setSortColumn={setSortColumn}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                sticky={sticky}
              />
            ))}
          </HeaderRow>
        </THead>
        <TBody ref={tbodyRef} as={override.TBody} {...tbodyProps}>
          {shownContent.map((rowContent, shownRowIndex) => {
            const rowIndex = allContent
              ? allContent.indexOf(rowContent)
              : shownRowIndex

            let yFrom = null
            let isAppearing = false
            if (slidingRowsByType) {
              const { slidingShownRows, appearingRows } = slidingRowsByType
              const slidingShownRowsMatch = slidingShownRows.find(
                ({ key }) => rowContent.key === key
              )
              if (slidingShownRowsMatch) {
                yFrom = slidingShownRowsMatch.yFrom
              } else if (appearingRows.find(key => rowContent.key === key)) {
                isAppearing = true
              }
            }

            return (
              <DataTableRow
                key={rowContent.key || `row_${rowContent.index}`}
                rowContent={rowContent}
                columnDefs={columnDefs}
                rowIndex={rowIndex}
                tbodyRef={tbodyRef}
                fadeIn={isAppearing}
                yFrom={yFrom}
                {...rowProps}
              />
            )
          })}
        </TBody>
      </Table>
      {hasPagination && (
        <DataTablePagination
          setRange={setRange}
          rowCounts={rowCounts}
          rowsPerPageOptions={rowsPerPageOptions}
          defaultPerPageIndex={defaultPerPageIndex}
          override={override}
        />
      )}
    </Container>
  )
}

DataTable.propTypes = {
  allContent: T.array.isRequired,
  shownContent: T.array.isRequired,
  columnDefs: T.array.isRequired,
  sortColumn: T.string,
  setSortColumn: T.func,
  sortDirection: T.string,
  setSortDirection: T.func,
  setRange: T.func,
  hasPagination: T.bool,
  hasSlidingRows: T.bool,
  rowCounts: T.object,
  rowHeight: T.number,
  rowsPerPageOptions: T.array,
  defaultPerPageIndex: T.number,
  sticky: T.oneOfType([T.number, T.bool]),
  rowProps: T.object,
  tbodyProps: T.object,
  override: T.object,
}

export default DataTable
