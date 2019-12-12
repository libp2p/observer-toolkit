import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import PeerAvatar from './PeerAvatar'
import PeerIdTooltip from './PeerIdTooltip'

const TruncatedPeerId = styled.span`
  font-family: plex-mono;
  display: inline-block;
  white-space: nowrap;
`

function PeerId({ peerId }) {
  const truncationLength = 5
  const truncatedId = peerId.slice(peerId.length - truncationLength)

  return (
    <PeerIdTooltip peerId={peerId} truncationLength={truncationLength}>
      <TruncatedPeerId>
        <PeerAvatar peerId={peerId} />
        {truncatedId}
      </TruncatedPeerId>
    </PeerIdTooltip>
  )
}

PeerId.propTypes = {
  peerId: T.string,
  children: T.node,
  onClick: T.func,
}

export default PeerId
