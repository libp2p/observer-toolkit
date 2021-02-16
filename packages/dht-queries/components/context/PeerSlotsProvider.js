import React, { useRef, createContext } from 'react'
import T from 'prop-types'

const PeerSlotsContext = createContext()

function PeerSlotsProvider({ children }) {
  // Central hash of peerId : where it's stored, for transitions
  // Should never cause a re-render because of reference equality to ref
  const peerSlotsRef = useRef({})
  return (
    <PeerSlotsContext.Provider value={peerSlotsRef}>
      {children}
    </PeerSlotsContext.Provider>
  )
}

PeerSlotsProvider.propTypes = {
  children: T.node,
}

export { PeerSlotsContext, PeerSlotsProvider }
