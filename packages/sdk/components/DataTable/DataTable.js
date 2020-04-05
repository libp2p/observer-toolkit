import React, { useRef } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import SlidingRowsContainer from './SlidingRowsContainer'
import DefaultDataTableRow from './DataTableRow'
import DefaultDataTableHead from './DataTableHead'
import DataTablePagination from './DataTablePagination'
import { Table, THead, THeadRow, TBody } from './styledTable'
import { SlidingRowProvider } from './context/SlidingRowProvider'

const Container = styled.div`
  position: relative;
`

const slideDuration = 600

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
  rowsPerPageOptions,
  defaultPerPageIndex,
  override = {},
}) {
  const tbodyRef = useRef()

  const { firstIndex, shown } = rowCounts
  const lastIndex = firstIndex + shown

  const DataTableRow = override.DataTableRow || DefaultDataTableRow
  const DataTableHead = override.DataTableHead || DefaultDataTableHead

  // Key rows by a unique identifying property if one is declared in column def
  const keyColumnIndex = columnDefs.findIndex(colDef => !!colDef.rowKey)
  const keyColumn = keyColumnIndex >= 0 && columnDefs[keyColumnIndex]
  const getRowKey = (rowContent, rowIndex) =>
    keyColumn ? rowContent[keyColumnIndex][keyColumn.rowKey] : `row_${rowIndex}`

  return (
    <SlidingRowProvider>
      <Container>
        <SlidingRowsContainer
          tbodyRef={tbodyRef}
          slideDuration={slideDuration}
          override={override}
        />
        <Table as={override.TableHead}>
          <THead as={override.THead}>
            <THeadRow as={override.THeadRow}>
              {columnDefs.map((columnDef, cellIndex) => (
                <DataTableHead
                  key={columnDef.name}
                  columnDef={columnDef}
                  cellIndex={cellIndex}
                  sortColumn={sortColumn}
                  setSortColumn={setSortColumn}
                  sortDirection={sortDirection}
                  setSortDirection={setSortDirection}
                />
              ))}
            </THeadRow>
          </THead>
          <TBody ref={tbodyRef} as={override.TBody}>
            {shownContent.map((rowContent, rowIndex) => {
              const key = getRowKey(rowContent, rowIndex)
              return (
                <DataTableRow
                  key={key}
                  rowContent={rowContent}
                  columnDefs={columnDefs}
                  rowIndex={rowIndex}
                  tbodyRef={tbodyRef}
                  slideDuration={slideDuration}
                  firstIndex={firstIndex}
                  lastIndex={lastIndex}
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
    </SlidingRowProvider>
  )
}

DataTable.propTypes = {
  allContent: T.array.isRequired,
  shownContent: T.array.isRequired,
  columnDefs: T.array.isRequired,
  columnMetadata: T.array,
  TableRow: T.any,
  TableHead: T.any,
  sortColumn: T.string,
  setSortColumn: T.func,
  sortDirection: T.string,
  setSortDirection: T.func,
  setRange: T.func,
  hasPagination: T.bool,
  rowCounts: T.object,
  rowsPerPageOptions: T.array,
  defaultPerPageIndex: T.number,
  override: T.object,
}

export default DataTable
