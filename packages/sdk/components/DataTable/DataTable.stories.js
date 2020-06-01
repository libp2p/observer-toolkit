import React from 'react'
import { storiesOf } from '@storybook/react'

import { ThemedMockDataTable } from '../../test-fixtures/MockDataTable'
import { longerMockStates } from '../../test-fixtures/tabularData'

storiesOf('DataTable', module).add(
  'DataTable unpaginated',
  () => <ThemedMockDataTable states={longerMockStates} />,
  {
    wrapper: 'theme',
  }
)

storiesOf('DataTable', module).add(
  'DataTable with pagination',
  () => <ThemedMockDataTable states={longerMockStates} hasPagination />,
  {
    wrapper: 'theme',
  }
)
