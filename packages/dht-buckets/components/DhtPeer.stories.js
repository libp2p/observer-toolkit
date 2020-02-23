import React, { useEffect, useState } from 'react'
import { storiesOf } from '@storybook/react'

import { ThemeWrapper } from '@libp2p-observer/testing'

import DhtPeer from './DhtPeer'

const distance = 45
const initialAge = 7000

const inboundQueries = [1000, 1800, 4000, 3950, 4100, 4300, 4550, 4850, 7000]

const outboundQueries = [200, 1600, 1100, 6500, 7300, 7700, 8100, 8400]

function DhtPeerFixture() {
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
      <DhtPeer
        inboundQueries={inboundQueries}
        outboundQueries={outboundQueries}
        timestamp={timestamp}
        distance={distance}
        age={initialAge + timestamp}
      />
    </ThemeWrapper>
  )
}

storiesOf('DhtBuckets', module).add('DhtPeer', () => <DhtPeerFixture />)
