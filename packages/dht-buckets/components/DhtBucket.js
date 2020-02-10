import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import DhtPeer from './DhtPeer'

// TODO: get this from messages and/or settings
const bucketCapacity = 20

const slotSize = 24
const borderWidth = 1

const peersPerRow = 4

const Bucket = styled.div`
  background: ${({ theme, backgroundColorIndex }) =>
    theme.color('contrast', backgroundColorIndex)};
  width: ${({ theme }) =>
    theme.spacing(1, true) * (peersPerRow + 1) + peersPerRow * slotSize}px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: ${({ theme }) => theme.spacing([1, 0.5])};
  margin: ${({ theme }) => theme.spacing()};
`

const Slot = styled.div`
  position: relative;
  margin: 4px;
  background: ${({ theme, isEmpty, backgroundColorIndex }) =>
    theme.color('contrast', isEmpty ? backgroundColorIndex : 0)};
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

const sortByAge = (a, b) => b.age - a.age
const sortByDistance = (a, b) => a.distance - b.distance

function DhtBucket({ peers, timestamp, isBucket0 }) {
  const emptySlots = bucketCapacity - peers.length

  const slots = [...peers, ...Array(emptySlots)].sort(
    isBucket0 ? sortByDistance : sortByAge
  )

  const backgroundColorIndex = isBucket0 ? 2 : 1

  return (
    <Bucket backgroundColorIndex={backgroundColorIndex}>
      {slots.map((peer, index) => (
        <Slot
          isEmpty={!peer}
          backgroundColorIndex={backgroundColorIndex}
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
    </Bucket>
  )
}

DhtBucket.propTypes = {
  children: T.node,
}

export default DhtBucket
