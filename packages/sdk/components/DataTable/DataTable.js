import React, { useRef } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import SlidingRowsContainer from './SlidingRowsContainer'
import DefaultDataTableRow from './DataTableRow'
import DefaultDataTableHead from './DataTableHead'
import { Table, THead, THeadRow, TBody } from './styledTable'
import {
  SlidingRowProvider,
  SlidingRowContext,
} from './context/SlidingRowProvider'

const Container = styled.div`
  position: relative;
`

function DataTable({
  contentProps,
  columnDefs,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
  override = {},
}) {
  const tbodyRef = useRef()

  const DataTableRow = override.DataTableRow || DefaultDataTableRow
  const DataTableHead = override.DataTableHead || DefaultDataTableHead

  // Key rows by a unique identifying property if one is declared in column def
  const keyColumnIndex = columnDefs.findIndex(colDef => !!colDef.rowKey)
  const keyColumn = keyColumnIndex >= 0 && columnDefs[keyColumnIndex]
  const getRowKey = (rowContentProps, rowIndex) =>
    keyColumn
      ? rowContentProps[keyColumnIndex][keyColumn.rowKey]
      : `row_${rowIndex}`

  return (
    <SlidingRowProvider>
      <Container>
        <SlidingRowsContainer tbodyRef={tbodyRef} override={override} />
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
            {contentProps.map((rowContentProps, rowIndex) => {
              const key = getRowKey(rowContentProps, rowIndex)
              return (
                <DataTableRow
                  key={key}
                  rowContentProps={rowContentProps}
                  columnDefs={columnDefs}
                  rowIndex={rowIndex}
                  tbodyRef={tbodyRef}
                />
              )
            })}
          </TBody>
        </Table>
      </Container>
    </SlidingRowProvider>
  )
}

DataTable.propTypes = {
  contentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
  columnMetadata: T.array,
  TableRow: T.any,
  TableHead: T.any,
  sortColumn: T.string,
  setSortColumn: T.func,
  sortDirection: T.string,
  setSortDirection: T.func,
  override: T.object,
}

export default DataTable
