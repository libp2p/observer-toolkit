import React, { useEffect, useState } from 'react'
import { storiesOf } from '@storybook/react'

import { ThemeWrapper } from '@libp2p-observer/testing'

import DhtBucket from './DhtBucket'

const peers = [
  {
    distance: 45,
    age: 7000,
    inboundQueries: [1000, 1800, 4000, 3950, 4100, 4300, 4550, 4850, 7000],
    outboundQueries: [200, 1600, 1100, 6500, 7300, 7700, 8100, 8400],
  },
  {
    distance: 25,
    age: 14000,
    inboundQueries: [4400, 9000],
    outboundQueries: [1100, 1150, 1200],
  },
  {
    distance: 5,
    age: 2000,
    inboundQueries: [7300, 7400, 7500, 7600, 7700],
    outboundQueries: [],
  },
  {
    distance: 12,
    age: 20000,
    inboundQueries: [],
    outboundQueries: [],
  },
  {
    distance: 12,
    age: 20000,
    inboundQueries: [100, 11500, 13200],
    outboundQueries: [12000, 12500, 15000],
  },
  {
    distance: 45,
    age: 20000,
    inboundQueries: [4400, 9000],
    outboundQueries: [],
  },
  {
    distance: 12,
    age: 2000,
    inboundQueries: [],
    outboundQueries: [1100, 1150, 1200],
  },
  {
    distance: 25,
    age: 14000,
    inboundQueries: [100, 11500, 13200],
    outboundQueries: [200, 1600, 1100, 6500, 7300, 7700, 8100, 8400],
  },
  {
    distance: 12,
    age: 20000,
    inboundQueries: [1000, 1800, 4000, 3950, 4100, 4300, 4550, 4850, 7000],
    outboundQueries: [],
  },
  {
    distance: 5,
    age: 7000,
    inboundQueries: [7300, 7400, 7500, 7600, 7700],
    outboundQueries: [1100, 1150, 1200],
  },
  {
    distance: 5,
    age: 14000,
    inboundQueries: [],
    outboundQueries: [200, 1600, 1100, 6500, 7300, 7700, 8100, 8400],
  },
  {
    distance: 25,
    age: 2000,
    inboundQueries: [100, 11500, 13200],
    outboundQueries: [12000, 12500, 15000],
  },
  {
    distance: 12,
    age: 7000,
    inboundQueries: [1000, 1800, 4000, 3950, 4100, 4300, 4550, 4850, 7000],
    outboundQueries: [],
  },
  {
    distance: 12,
    age: 20000,
    inboundQueries: [7300, 7400, 7500, 7600, 7700],
    outboundQueries: [12000, 12500, 15000],
  },
]

function DhtBucketFixture() {
  const [timestamp, setTimestamp] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(timestamp + 1000)
    }, 1000)

    if (timestamp >= 20000) clearInterval(interval)

    return () => {
      clearInterval(interval)
    }
  })

  return (
    <ThemeWrapper>
      <DhtBucket peers={peers} timestamp={timestamp} />
    </ThemeWrapper>
  )
}

storiesOf('DhtBuckets', module).add('DhtBucket', () => <DhtBucketFixture />)
