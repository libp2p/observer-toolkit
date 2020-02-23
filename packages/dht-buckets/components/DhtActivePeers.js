import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import DhtBucket from './DhtBucket'

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
      <DhtBucket
        peers={catchAllBucketPeers}
        timestamp={timestamp}
        index={0}
        key={`bucket_0`}
        title="0: Catch-all"
      />
      {numberedBucketPeers.map((peers, index) => (
        <DhtBucket
          peers={peers}
          timestamp={timestamp}
          index={index + 1}
          key={`bucket_${index + 1}`}
        />
      ))}
    </Container>
  )
}

DhtActivePeers.propTypes = {
  catchAllBucketPeers: T.array.isRequired,
  numberedBucketPeers: T.array.isRequired,
  timestamp: T.number,
}

export default DhtActivePeers
