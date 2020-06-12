import React, { useEffect, useMemo, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { dhtStatusNames } from '@libp2p/observer-data'

import DhtBucketInfo from './DhtBucketInfo'
import DhtBucket from '../DhtBucket/DhtBucket'

import CandidatePeers from './CandidatePeers'

function processPeers(peers) {
  // Unpack protobuf peer data unless it's already pre-unpacked
  return peers.map(peer => {
    if (!peer.getPeerId) return peer
    return {
      peerId: peer.getPeerId(),
      age: peer.getAgeInBucket(),
      status: dhtStatusNames[peer.getStatus()],
    }
  })
}

const Container = styled.div`
  border-left: 1px solid ${({ theme }) => theme.color('background', 1)};
  border-right: 1px solid ${({ theme }) => theme.color('background', 1)};
  padding: ${({ theme }) => theme.spacing([1, 0.5])};
`

const Spacer = styled.div`
  display: block;
  background: ${({ theme }) => theme.color('background')};
  padding: ${({ theme }) => theme.spacing()};
  font-weight: 700;
  ${({ theme }) => theme.text('label', 'medium')}
`

const sortByAge = (a, b) => b.age - a.age

function DhtColumn({ peers = [], bucketNum = 1, timestamp, title }) {
  const [selectedPeer, setSelectedPeer] = useState(null)

  const processedPeers = useMemo(() => {
    const processedPeers = processPeers(peers)
    processedPeers.sort(sortByAge)
    return processedPeers
  }, [peers])

  useEffect(() => {
    if (
      selectedPeer &&
      !processedPeers.some(({ peerId }) => selectedPeer.peerId)
    ) {
      setSelectedPeer(null)
    }
  }, [selectedPeer, processedPeers])

  const infoPeers = selectedPeer ? [selectedPeer] : processedPeers

  return (
    <Container>
      {bucketNum !== 0 ? (
        <CandidatePeers bucketNum={bucketNum} />
      ) : (
        <Spacer>Catch-all bucket</Spacer>
      )}
      <DhtBucket
        peers={processedPeers}
        selectedPeer={selectedPeer}
        setSelectedPeer={setSelectedPeer}
        timestamp={timestamp}
        bucketNum={bucketNum}
        title={title}
      />
      <DhtBucketInfo peers={infoPeers} />
    </Container>
  )
}

DhtColumn.propTypes = {
  peers: T.array,
  bucketNum: T.number,
  timestamp: T.number.isRequired,
  title: T.string,
  children: T.node,
}

export default DhtColumn
