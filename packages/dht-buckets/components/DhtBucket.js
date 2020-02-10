import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import DhtPeer from './DhtPeer'

// TODO: get this from messages and/or settings
const bucketCapacity = 20

const slotSize = 24
const borderWidth = 1

const peersPerRow = 4

const Container = styled.div`
  background: ${({ theme, bkgColorIndex }) =>
    theme.color('contrast', bkgColorIndex)};
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
    theme.color('contrast', isEmpty ? bkgColorIndex : 0)};
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

function getTitle(peers, index) {
  const { min, max } = peers.reduce(
    ({ min, max }, peer) => ({
      min: Math.floor(Math.min(min, peer.distance)),
      max: Math.ceil(Math.max(max, peer.distance)),
    }),
    { min: Infinity, max: 0 }
  )

  return `${index}: Distances ${min}–${max}`
}

function DhtBucket({
  peers,
  index = 1,
  timestamp,
  title = getTitle(peers, index),
}) {
  const emptySlots = bucketCapacity - peers.length

  const isBucket0 = index === 0

  const slots = [...peers, ...Array(emptySlots)].sort(
    isBucket0 ? sortByDistance : sortByAge
  )

  const bkgColorIndex = isBucket0 ? 2 : 1

  return (
    <Container bkgColorIndex={bkgColorIndex}>
      <Title>{title}</Title>
      <BucketSlots>
        {slots.map((peer, index) => (
          <Slot
            isEmpty={!peer}
            bkgColorIndex={bkgColorIndex}
            key={`bucket_${index}`}
          >
            {peer && (
              <PeerContainer>
                <DhtPeer
                  inboundQueries={peer.inboundQueries}
                  outboundQueries={peer.outboundQueries}
                  distance={peer.distance}
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
  children: T.node,
}

export default DhtBucket
