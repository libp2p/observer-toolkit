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

function DhtSlot({ peer, timestamp, isBucket0, bkgColorIndex }) {
  const slotRef = useRef()
  const peerSlotsRef = useContext(PeerSlotsContext)
  const previousSlotRef = peer ? peerSlotsRef.current[peer.peerId] : null

  useEffect(() => {
    if (peer) {
      peerSlotsRef.current[peer.peerId] = slotRef
    }
  })

  return (
    <Slot isEmpty={!peer} bkgColorIndex={bkgColorIndex} ref={slotRef}>
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
