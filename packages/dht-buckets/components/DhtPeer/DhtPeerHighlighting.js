import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { PeersContext } from '@libp2p/observer-sdk'

const Highlight = styled.div`
  position: absolute;
  top: -2px;
  bottom: -2px;
  left: -2px;
  right: -4px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.color('background', 0, 0.6)};
`

function DhtPeerHighlighting({ peerId }) {
  // Nest this inside DhtPeer so changes to PeersContext
  // don't cause a re-render re-triggering animations
  const globalPeerIds = useContext(PeersContext)
  const isHighlighted = globalPeerIds.includes(peerId)

  return isHighlighted ? <Highlight /> : ''
}
DhtPeerHighlighting.propTypes = {
  peerId: T.string,
}

export default DhtPeerHighlighting
