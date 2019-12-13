import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import PeerIdAvatar from './PeerIdAvatar'
import PeerIdTooltip from './PeerIdTooltip'
import PeerIdTruncated from './PeerIdTruncated'

const NoWrap = styled.span`
  white-space: nowrap;
`

function PeerIdChip({ peerId }) {
  return (
    <PeerIdTooltip peerId={peerId}>
      <NoWrap>
        <PeerIdAvatar peerId={peerId} />
        <PeerIdTruncated peerId={peerId} />
      </NoWrap>
    </PeerIdTooltip>
  )
}

PeerIdChip.propTypes = {
  peerId: T.string,
  children: T.node,
  onClick: T.func,
}

export default PeerIdChip
