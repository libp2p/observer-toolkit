import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { dhtStatusNames } from '@libp2p-observer/data'

import DhtPeer from './DhtPeer'

// TODO: get this from messages and/or settings
const bucketCapacity = 20

const slotSize = 24
const borderWidth = 1

const peersPerRow = 4

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

const Slot = styled.div`
  position: relative;
  margin: 4px;
  background: ${({ theme, isEmpty, bkgColorIndex }) =>
    isEmpty
      ? theme.color('tertiary', bkgColorIndex)
      : theme.color('contrast', 0)};
  border-width: ${borderWidth}px;
  border-style: solid;
  border-color: ${({ theme, isEmpty }) =>
    theme.color('background', 1, isEmpty ? 0.2 : 0)};
  width: ${slotSize - 2 * borderWidth}px;
  height: ${slotSize - 2 * borderWidth}px;
`

const PeerContainer = styled.div`
  top: -2px;
  left: -2px;
  position: relative;
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

  const slots = [...processPeers(peers), ...Array(emptySlots)].sort(
    isBucket0 ? sortByDistance : sortByAge
  )

  const bkgColorIndex = isBucket0 ? 2 : 3

  return (
    <Container bkgColorIndex={bkgColorIndex}>
      <Title>{title}</Title>
      <BucketSlots>
        {slots.map((peer, index) => (
          <Slot
            isEmpty={!peer}
            bkgColorIndex={bkgColorIndex}
            key={`bucket_slot_${index}`}
          >
            {peer && (
              <PeerContainer>
                <DhtPeer
                  inboundQueries={peer.inboundQueries}
                  outboundQueries={peer.outboundQueries}
                  peerId={peer.peerId}
                  status={peer.status}
                  age={peer.age}
                  timestamp={timestamp}
                />
              </PeerContainer>
            )}
          </Slot>
        ))}
      </BucketSlots>
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
