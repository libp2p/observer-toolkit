import React from 'react'
import { storiesOf } from '@storybook/react'

import DhtLookups from './DhtLookups'

storiesOf('DhtLookups', module).add('DhtLookups', () => <DhtLookups />, {
  wrapper: 'shell',
})
