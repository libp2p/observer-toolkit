import React, { useContext, useState } from 'react'

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
    columnDefs,
    contentProps,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
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
        contentProps={contentProps}
        columnDefs={columnDefs}
        sortColumn={sortColumn}
        setSortColumn={setSortColumn}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
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
