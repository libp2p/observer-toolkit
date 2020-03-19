import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import DhtBucketSlot from './DhtBucketSlot'

import { bucketCapacity, slotSize, peersPerRow } from '../../utils/constants'

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

const Title = styled.h4`
  padding: ${({ theme }) => theme.spacing([0.5, 1, 1, 1])};
  color: ${({ theme }) => theme.color('text', 3, 0.8)};
  ${({ theme }) => theme.text('heading', 'small')}
`

function DhtBucket({
  peers = [],
  bucketNum = 1,
  timestamp,
  title = `${bucketNum}`,
  selectedPeer,
  setSelectedPeer,
}) {
  const emptySlots = bucketCapacity - peers.length
  if (emptySlots < 0) {
    console.warn(
      `Invalid data recieved: ${peers.length} peers in bucket ${bucketNum} with capacity ${bucketCapacity}`
    )
  }
  const validatedEmptySlots = Math.max(0, emptySlots)

  const isBucket0 = bucketNum === 0

  const slots = [...peers, ...Array(validatedEmptySlots)]

  const bkgColorIndex = isBucket0 ? 2 : 3

  return (
    <Container bkgColorIndex={bkgColorIndex}>
      <Title>{title}</Title>
      <BucketSlots>
        {slots.map((peer, index) => (
          <DhtBucketSlot
            key={`bucket_slot_${index}`}
            peer={peer}
            timestamp={timestamp}
            isBucket0={isBucket0}
            bkgColorIndex={bkgColorIndex}
            selectedPeer={selectedPeer}
            setSelectedPeer={setSelectedPeer}
          />
        ))}
      </BucketSlots>
    </Container>
  )
}

DhtBucket.propTypes = {
  peers: T.array,
  bucketNum: T.number,
  timestamp: T.number.isRequired,
  title: T.string,
  selectedPeer: T.object,
  setSelectedPeer: T.func,
  children: T.node,
}

export default DhtBucket
