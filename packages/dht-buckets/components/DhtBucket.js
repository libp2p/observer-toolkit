import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { dhtStatusNames } from '@libp2p-observer/data'

import DhtBucketSlot from './DhtBucketSlot'
import DhtBucketInfo from './DhtBucketInfo'

import {
  bucketCapacity,
  slotSize,
  borderWidth,
  peersPerRow,
} from '../utils/constants'

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

const Bucket = styled.div`
  background: ${({ theme, bkgColorIndex }) =>
    theme.color('tertiary', bkgColorIndex)};
  width: ${({ theme }) =>
    theme.spacing(1, true) * (peersPerRow + 1) + peersPerRow * slotSize}px;
  padding: ${({ theme }) => theme.spacing([1, 0.5])};
  margin: ${({ theme }) => theme.spacing()};
`

const BucketSlots = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`

const Title = styled.h4`
  padding: ${({ theme }) => theme.spacing([0.5, 1, 1, 1])};
  color: ${({ theme }) => theme.color('text', 3, 0.8)};
  ${({ theme }) => theme.text('heading', 'small')}
`

const sortByAge = (a, b) => b.age - a.age
const sortByDistance = (a, b) => a.distance - b.distance

function DhtBucket({
  peers = [],
  bucketNum = 1,
  timestamp,
  title = `${bucketNum}`,
}) {
  const emptySlots = bucketCapacity - peers.length

  const isBucket0 = bucketNum === 0

  const processedPeers = processPeers(peers)
  processedPeers.sort(sortByAge)
  const slots = [...processedPeers, ...Array(emptySlots)]

  const bkgColorIndex = isBucket0 ? 2 : 3

  return (
    <Container>
      <Bucket bkgColorIndex={bkgColorIndex}>
        <Title>{title}</Title>
        <BucketSlots>
          {slots.map((peer, index) => (
            <DhtBucketSlot
              key={`bucket_slot_${index}`}
              peer={peer}
              timestamp={timestamp}
              isBucket0={isBucket0}
              bkgColorIndex={bkgColorIndex}
            />
          ))}
        </BucketSlots>
      </Bucket>
      <DhtBucketInfo peers={processedPeers} />
    </Container>
  )
}

DhtBucket.propTypes = {
  peers: T.array,
  index: T.number,
  timestamp: T.number.isRequired,
  title: T.string,
  children: T.node,
}

export default DhtBucket