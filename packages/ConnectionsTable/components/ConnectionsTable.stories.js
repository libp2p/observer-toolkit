import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { jsxDecorator } from 'storybook-addon-jsx'

import ConnectionsTable from './ConnectionsTable'

storiesOf('DataTable', module)
  .addDecorator(jsxDecorator)
  .addDecorator(withKnobs)
  .add('DataTable', () => <ConnectionsTable />)
