import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  getAllDhtBuckets,
  getDhtPeersInBucket,
  getTime,
} from '@libp2p-observer/data'
import { TimeContext } from '@libp2p-observer/sdk'

import DhtColumn from './DhtColumn/DhtColumn'

const Container = styled.div`
  background: ${({ theme, backgroundColorIndex }) =>
    theme.color('background', 1)};
  display: flex;
  flex-direction: row;
  justify-content: start;
  padding: ${({ theme }) => theme.spacing([1, 0.5])};
`

function DhtBuckets({ children }) {
  const currentState = useContext(TimeContext)
  const timestamp = getTime(currentState)

  const bucketsData = getAllDhtBuckets(currentState)
    .map(bucket => ({
      distance: bucket.getDistance(),
      peers: getDhtPeersInBucket(bucket, currentState),
    }))
    .sort((a, b) => a.distance - b.distance)
  const [catchAllBucketData, ...numberedBucketData] = bucketsData

  return (
    <Container>
      <DhtColumn
        peers={catchAllBucketData.peers}
        timestamp={timestamp}
        bucketNum={0}
        key={`bucket_0`}
      />
      {numberedBucketData.map(({ distance, peers }) => (
        <DhtColumn
          peers={peers}
          timestamp={timestamp}
          bucketNum={distance}
          key={`bucket_${distance}`}
        />
      ))}
    </Container>
  )
}

DhtBuckets.propTypes = {
  children: T.node,
}

export default DhtBuckets
