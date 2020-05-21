import React, { useState } from 'react'
import T from 'prop-types'

import { ThemeWrapper } from '@libp2p/observer-testing'

import { mockStates, mockColumnDefs } from './tabularData'
import providers from './providers'
import { useTabularData } from '../hooks'
import { DataTable, StyledButton } from '../components'

function MockDataTable({ states = mockStates, hasPagination = false }) {
  const [data, setData] = useState(states[states.length - 1])

  const metadata = {
    percentTotal: data.reduce(
      (total, { mockPercentCalc }) => total + mockPercentCalc,
      0
    ),
  }

  const rowsPerPageOptions = [2, 3, 4, 5, 10]
  const defaultPerPageIndex = 3
  const range = hasPagination
    ? [0, rowsPerPageOptions[defaultPerPageIndex]]
    : null

  const {
    allContent,
    shownContent,
    columnDefs,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    rowCounts,
    setRange,
  } = useTabularData({
    columns: mockColumnDefs,
    data,
    defaultSort: 'mockName',
    metadata,
    range,
  })

  const paginationProps = hasPagination
    ? {
        hasPagination,
        rowsPerPageOptions,
        defaultPerPageIndex,
        setRange,
      }
    : {}

  return (
    <div>
      <div data-testid="data-switchers">
        {states.map((datum, index) => (
          <StyledButton
            key={`button_${index}`}
            onClick={() => setData(states[index])}
            isActive={states[index] === data}
          >
            Select [{index}]
          </StyledButton>
        ))}
      </div>
      <DataTable
        allContent={allContent}
        shownContent={shownContent}
        columnDefs={columnDefs}
        sortColumn={sortColumn}
        setSortColumn={setSortColumn}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        rowCounts={rowCounts}
        {...paginationProps}
      />
    </div>
  )
}
MockDataTable.propTypes = {
  states: T.array,
  hasPagination: T.bool,
}

function ThemedMockDataTable(props) {
  return (
    <ThemeWrapper providers={providers}>
      <MockDataTable {...props} />
    </ThemeWrapper>
  )
}

export { MockDataTable, ThemedMockDataTable }
