import React from 'react'
import { storiesOf } from '@storybook/react'

import { ThemedMockDataTable } from '../../test-fixtures/DataTable'

storiesOf('DataTable', module).add('DataTable', () => <ThemedMockDataTable />)
