import React, { useRef, useContext, useEffect } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import DhtPeer from '../DhtPeer/DhtPeer'
import { PeerSlotsContext } from '../context/PeerSlotsProvider'

import { slotSize, borderWidth } from '../../utils/constants'

const Slot = styled.div`
  position: relative;
  margin: 4px;
  background: ${({ theme, isEmpty, bkgColorIndex }) =>
    isEmpty
      ? theme.color('tertiary', bkgColorIndex)
      : theme.color('contrast', 0, 0.25)};
  border-width: ${borderWidth}px;
  border-style: solid;
  border-color: ${({ theme, isEmpty, isSelected }) =>
    theme.color('background', 1, isEmpty ? 0.2 : 0)};
  width: ${slotSize - 2 * borderWidth}px;
  height: ${slotSize - 2 * borderWidth}px;
  ${({ isSelected, theme }) =>
    !isSelected
      ? ''
      : `
    box-shadow: 0 0 8px ${theme.color('background', 0, 0.8)};
  `}
`

const PeerContainer = styled.div`
  top: -2px;
  left: -2px;
  position: relative;
`

function getPreviousSlotRef(peer, peerSlotsRef, slotRef) {
  const previousSlot = peerSlotsRef.current[peer.peerId]

  // If this is first render, treat the peer like it was always here
  if (!previousSlot && !slotRef.current) return slotRef

  // Else return previous slot, or, nothing indicating this peer is newly appearing
  return previousSlot || null
}

function DhtBucketSlot({
  peer,
  timestamp,
  isBucket0,
  bkgColorIndex,
  selectedPeer,
  setSelectedPeer,
  slotIndex,
}) {
  const slotRef = useRef()
  const peerSlotsRef = useContext(PeerSlotsContext)

  const previousSlotRef = peer
    ? getPreviousSlotRef(peer, peerSlotsRef, slotRef)
    : slotRef.current

  useEffect(() => {
    if (peer) {
      peerSlotsRef.current[peer.peerId] = slotRef
      slotRef.current.setAttribute('data-peerId', peer.peerId)
    } else {
      // Clear assignment of this slot on emptying so reappearing peers appear to reappear
      const dataPeerId = slotRef.current.getAttribute('data-peerId')
      if (dataPeerId && peerSlotsRef.current[dataPeerId] === slotRef) {
        peerSlotsRef.current[dataPeerId] = null
      }
    }
  })

  const handleClick = () => {
    if (selectedPeer && peer && selectedPeer.peerId === peer.peerId) {
      setSelectedPeer(null)
    } else {
      setSelectedPeer(peer)
    }
  }
  const isSelected = peer && selectedPeer && peer.peerId === selectedPeer.peerId

  return (
    <Slot
      onClick={handleClick}
      isSelected={isSelected}
      isEmpty={!peer}
      bkgColorIndex={bkgColorIndex}
      ref={slotRef}
    >
      {peer && (
        <PeerContainer>
          <DhtPeer
            key={`peer_${peer.peerId}`}
            inboundQueries={peer.inboundQueries}
            outboundQueries={peer.outboundQueries}
            peerId={peer.peerId}
            status={peer.status}
            age={peer.age}
            timestamp={timestamp}
            showDistance={isBucket0}
            slotRef={slotRef}
            previousSlotRef={previousSlotRef}
          />
        </PeerContainer>
      )}
    </Slot>
  )
}

DhtBucketSlot.propTypes = {
  peer: T.object,
  timestamp: T.number,
  isBucket0: T.bool,
  bkgColorIndex: T.number,
  slotIndex: T.number,
  selectedPeer: T.object,
  setSelectedPeer: T.func,
}

export default DhtBucketSlot
