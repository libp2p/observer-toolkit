import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { getAllDhtBuckets, getTime } from '@libp2p-observer/data'
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

  const buckets = getAllDhtBuckets(currentState)
  const { [0]: catchAllBucketPeers, ...numberedBucketPeers } = buckets

  return (
    <Container>
      <DhtColumn
        peers={catchAllBucketPeers.getPeersList()}
        timestamp={timestamp}
        bucketNum={0}
        key={`bucket_0`}
        title="0 — Catch-all"
      />
      {Object.entries(numberedBucketPeers).map(([bucketStr, bucket]) => (
        <DhtColumn
          peers={bucket.getPeersList()}
          timestamp={timestamp}
          bucketNum={bucket.getDistance()}
          key={`bucket_${bucketStr}`}
        />
      ))}
    </Container>
  )
}

DhtBuckets.propTypes = {
  children: T.node,
}

export default DhtBuckets
