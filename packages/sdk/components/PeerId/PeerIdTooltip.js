import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import Tooltip from '../Tooltip'
import StyledButton from '../input/StyledButton'
import { copyToClipboard } from '../../utils/helpers'

const SegmentedPeerId = styled.div`
  padding-top: ${({ theme }) => theme.spacing()};
  font-family: plex-mono;
  font-size: 9pt;
`

function PeerIdTooltip({ peerId, children }) {
  const segmentsCount = 4
  const segmentsLength = Math.round(peerId.length / segmentsCount) // Usually 64 / 4 = 16
  const peerIdSegments = []
  let i = 0
  while (i < segmentsCount) {
    const segment = peerId.slice(segmentsLength * i, segmentsLength * (i + 1))
    peerIdSegments.push(<span key={`segment-${i}`}>{segment}</span>)
    i++
    if (i < segmentsCount) peerIdSegments.push(<wbr key={`break-${i}`} />)
  }

  const copyPeerId = () => copyToClipboard(peerId)

  return (
    <Tooltip
      side="right"
      content={
        <>
          <StyledButton onClick={copyPeerId}>COPY PEER ID</StyledButton>
          <SegmentedPeerId>{peerIdSegments}</SegmentedPeerId>
        </>
      }
    >
      {children}
    </Tooltip>
  )
}

export default PeerIdTooltip
