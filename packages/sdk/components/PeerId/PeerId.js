import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import PeerIdTooltip from './PeerIdTooltip'

const TruncatedPeerId = styled.span`
  font-family: plex-mono;
  display: inline-block;
`

function PeerId({ peerId }) {
  const truncationLength = 5
  const truncatedId = peerId.slice(peerId.length - truncationLength)

  return (
    <PeerIdTooltip peerId={peerId} truncationLength={truncationLength}>
      <TruncatedPeerId>{'…' + truncatedId}</TruncatedPeerId>
    </PeerIdTooltip>
  )
}

PeerId.propTypes = {
  peerId: T.string,
  children: T.node,
  onClick: T.func,
}

export default PeerId
