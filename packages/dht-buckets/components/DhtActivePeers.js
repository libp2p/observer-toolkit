import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import DhtColumn from './DhtColumn/DhtColumn'

const Container = styled.div`
  background: ${({ theme, backgroundColorIndex }) =>
    theme.color('background', 1)};
  display: flex;
  flex-direction: row;
  justify-content: start;
  padding: ${({ theme }) => theme.spacing([1, 0.5])};
`

function DhtActivePeers({
  catchAllBucketPeers,
  numberedBucketPeers,
  timestamp,
}) {
  return (
    <Container>
      <DhtColumn
        peers={catchAllBucketPeers}
        timestamp={timestamp}
        bucketNum={0}
        key={`bucket_0`}
        title="0 — Catch-all"
      />
      {Object.entries(numberedBucketPeers).map(([bucketStr, peers]) => (
        <DhtColumn
          peers={peers}
          timestamp={timestamp}
          bucketNum={Number(bucketStr)}
          key={`bucket_${bucketStr}`}
        />
      ))}
    </Container>
  )
}

DhtActivePeers.propTypes = {
  catchAllBucketPeers: T.array.isRequired,
  numberedBucketPeers: T.object.isRequired,
  timestamp: T.number,
}

export default DhtActivePeers
