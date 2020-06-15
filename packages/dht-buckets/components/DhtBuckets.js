import React, { useContext, useMemo } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  getAllDhtBuckets,
  getDhtPeersInBucket,
  getStateTime,
} from '@libp2p/observer-data'
import { TimeContext } from '@libp2p/observer-sdk'

import DhtBucketsKey from './DhtBucketsKey'
import DhtColumn from './DhtColumn/DhtColumn'

const Container = styled.div`
  background: ${({ theme, backgroundColorIndex }) =>
    theme.color('background', 1)};
  padding: ${({ theme }) => theme.spacing([1, 0.5])};
`

const ColumnsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  padding: ${({ theme }) => theme.spacing([1, 0.5])};
  overflow-x: scroll;
`

function DhtBuckets({ children }) {
  const currentState = useContext(TimeContext)
  const { catchAllBucketData, numberedBucketData } = useMemo(() => {
    if (!currentState) return {}
    const bucketsData = getAllDhtBuckets(currentState)
      .map(bucket => ({
        distance: bucket.getCpl(),
        peers: getDhtPeersInBucket(bucket, currentState),
      }))
      .sort((a, b) => a.distance - b.distance)
    const [catchAllBucketData, ...numberedBucketData] = bucketsData
    return {
      catchAllBucketData,
      numberedBucketData,
    }
  }, [currentState])

  if (!currentState) return 'Loading...'
  const timestamp = getStateTime(currentState)

  return (
    <Container>
      <DhtBucketsKey />
      <ColumnsWrapper>
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
      </ColumnsWrapper>
    </Container>
  )
}

DhtBuckets.propTypes = {
  children: T.node,
}

export default DhtBuckets
