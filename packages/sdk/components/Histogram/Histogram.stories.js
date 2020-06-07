import React from 'react'
import T from 'prop-types'
import { storiesOf } from '@storybook/react'

import Histogram from './Histogram'
import { usePooledData } from '../../hooks'
import mockData from '../../test-fixtures/poolable-data'

function MockHistogram({ data = mockData, poolings, initialPoolSets }) {
  const { pooledData, poolSets } = usePooledData({
    data,
    poolings,
    poolsets: initialPoolSets,
  })
  return (
    <Histogram
      pooledData={pooledData}
      poolSets={poolSets}
      xAxisSuffix={'units'}
    />
  )
}
MockHistogram.propTypes = {
  data: T.array,
  poolings: T.any,
  initialPoolSets: T.array,
}

storiesOf('Histogram', module).add(
  'Single variable linear histogram',
  () => <MockHistogram poolings={{ mapData: d => d.a }} />,
  {
    wrapper: 'theme',
  }
)

storiesOf('Histogram', module).add(
  'Single variable logarithmic histogram',
  () => <MockHistogram poolings={{ mapData: d => d.d, scaleType: 'log' }} />,
  {
    wrapper: 'theme',
  }
)
