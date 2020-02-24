import React, { useEffect, useState } from 'react'
import { storiesOf } from '@storybook/react'

import { ThemeWrapper } from '@libp2p-observer/testing'

import DhtActivePeers from './DhtActivePeers'

const initialAge = 7000

const mapQueryTimes = time => ({ start: time })

const bucket0 = [
  {
    distance: 45,
    age: 7000,
    inboundQueries: [1000, 1800, 4000, 3950, 4100, 4300, 4550, 4850, 7000].map(
      mapQueryTimes
    ),
    outboundQueries: [200, 1600, 1100, 6500, 7300, 7700, 8100, 8400].map(
      mapQueryTimes
    ),
  },
  {
    distance: 25,
    age: 14000,
    inboundQueries: [4400, 9000].map(mapQueryTimes),
    outboundQueries: [1100, 1150, 1200].map(mapQueryTimes),
  },
  {
    distance: 5,
    age: 2000,
    inboundQueries: [7300, 7400, 7500, 7600, 7700].map(mapQueryTimes),
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
    inboundQueries: [100, 11500, 13200].map(mapQueryTimes),
    outboundQueries: [12000, 12500, 15000].map(mapQueryTimes),
  },
  {
    distance: 45,
    age: 20000,
    inboundQueries: [4400, 9000].map(mapQueryTimes),
    outboundQueries: [],
  },
  {
    distance: 12,
    age: 2000,
    inboundQueries: [],
    outboundQueries: [1100, 1150, 1200].map(mapQueryTimes),
  },
  {
    distance: 25,
    age: 14000,
    inboundQueries: [100, 11500, 13200].map(mapQueryTimes),
    outboundQueries: [200, 1600, 1100, 6500, 7300, 7700, 8100, 8400].map(
      mapQueryTimes
    ),
  },
  {
    distance: 12,
    age: 20000,
    inboundQueries: [1000, 1800, 4000, 3950, 4100, 4300, 4550, 4850, 7000].map(
      mapQueryTimes
    ),
    outboundQueries: [],
  },
  {
    distance: 5,
    age: 7000,
    inboundQueries: [7300, 7400, 7500, 7600, 7700].map(mapQueryTimes),
    outboundQueries: [1100, 1150, 1200].map(mapQueryTimes),
  },
  {
    distance: 5,
    age: 14000,
    inboundQueries: [],
    outboundQueries: [200, 1600, 1100, 6500, 7300, 7700, 8100, 8400].map(
      mapQueryTimes
    ),
  },
  {
    distance: 25,
    age: 2000,
    inboundQueries: [100, 11500, 13200].map(mapQueryTimes),
    outboundQueries: [12000, 12500, 15000].map(mapQueryTimes),
  },
  {
    distance: 12,
    age: 7000,
    inboundQueries: [1000, 1800, 4000, 3950, 4100, 4300, 4550, 4850, 7000].map(
      mapQueryTimes
    ),
    outboundQueries: [],
  },
  {
    distance: 12,
    age: 20000,
    inboundQueries: [7300, 7400, 7500, 7600, 7700].map(mapQueryTimes),
    outboundQueries: [12000, 12500, 15000].map(mapQueryTimes),
  },
].map(randomisePeer)

const buckets = [5, 15, 25, 30].map(averageDistance =>
  getRandomBucket(averageDistance)
)

buckets.push(getRandomBucket(35, 8))

const bucketsObj = buckets.reduce(
  (obj, bucket, index) => ({
    ...obj,
    [index]: bucket,
  }),
  {}
)

function getRandomBucket(averageDistance, length = 20) {
  const peers = []
  while (peers.length < length) {
    const peer = {
      age: initialAge * getRandomMultiplier(0.8),
      distance: averageDistance + 10 * getRandomMultiplier(0.5),
      inboundQueries: randomiseTimes(
        bucket0[Math.floor(Math.random() * 14)].inboundQueries
      ),
      outboundQueries: randomiseTimes(
        bucket0[Math.floor(Math.random() * 14)].outboundQueries
      ),
    }
    peers.push(peer)
  }
  return peers
}

function randomisePeer(peer) {
  return {
    ...peer,
    inboundQueries: randomiseTimes(peer.inboundQueries),
    outboundQueries: randomiseTimes(peer.outboundQueries),
  }
}

function randomiseTimes(times) {
  return times.map(time => time * getRandomMultiplier())
}

function getRandomMultiplier(dec = 0.1) {
  return 1 - dec + 2 * dec * Math.random()
}

function DhtActivePeersFixture() {
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
      <DhtActivePeers
        catchAllBucketPeers={bucket0}
        numberedBucketPeers={bucketsObj}
        timestamp={timestamp}
      />
    </ThemeWrapper>
  )
}

storiesOf('DhtBuckets', module).add('DhtActivePeers', () => (
  <DhtActivePeersFixture />
))
