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
      {Object.entries(numberedBucketPeers).map(([bucketNum, peers]) => (
        <>
          {console.log('bucketNum', typeof bucketNum, bucketNum)}
          <DhtBucket
            peers={peers}
            timestamp={timestamp}
            index={Number(bucketNum) + 1}
            key={`bucket_${Number(bucketNum) + 1}`}
          />
        </>
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
