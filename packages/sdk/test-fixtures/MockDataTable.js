import React, { useState } from 'react'

import { ThemeWrapper } from '@libp2p-observer/testing'

import { mockStates, mockColumnDefs } from './tabularData'
import providers from './providers'
import { useTabularData } from '../hooks'
import { DataTable, StyledButton } from '../components'

function MockDataTable() {
  const [data, setData] = useState(mockStates[mockStates.length - 1])

  const metadata = {
    percentTotal: data.reduce(
      (total, { mockPercentCalc }) => total + mockPercentCalc,
      0
    ),
  }

  const {
    allContent,
    shownContent,
    columnDefs,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    rowCounts,
  } = useTabularData({
    columns: mockColumnDefs,
    data,
    defaultSort: 'mockName',
    metadata,
  })

  return (
    <div>
      <div data-testid="data-switchers">
        {mockStates.map((datum, index) => (
          <StyledButton
            key={`button_${index}`}
            onClick={() => setData(mockStates[index])}
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
      />
    </div>
  )
}

function ThemedMockDataTable() {
  return (
    <ThemeWrapper providers={providers}>
      <MockDataTable />
    </ThemeWrapper>
  )
}

export { MockDataTable, ThemedMockDataTable }
