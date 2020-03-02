import React, { useRef, useContext, useEffect } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import DhtPeer from './DhtPeer'
import { PeerSlotsContext } from './context/PeerSlotsProvider'

import { slotSize, borderWidth } from '../utils/constants'

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

function DhtSlot({
  peer,
  timestamp,
  isBucket0,
  bkgColorIndex,
  selectedPeer,
  setSelectedPeer,
}) {
  const slotRef = useRef()
  const peerSlotsRef = useContext(PeerSlotsContext)
  const previousSlotRef = peer ? peerSlotsRef.current[peer.peerId] : null

  useEffect(() => {
    if (peer) {
      peerSlotsRef.current[peer.peerId] = slotRef
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

export default DhtSlot
