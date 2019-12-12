import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import Tooltip from '../Tooltip'
import StyledButton from '../input/StyledButton'
import { getTruncatedPeerId } from './utils'
import { RootNodeContext } from '../context/RootNodeProvider'
import { copyToClipboard } from '../../utils/helpers'

const SegmentedPeerId = styled.div`
  padding-top: ${({ theme }) => theme.spacing()};
  font-family: plex-mono;
  font-size: 9pt;
  color: ${({ theme }) => theme.color('text', 1)};
  cursor: text;
  user-select: text;
`

const Positioner = styled.div`
  top: -${({ theme }) => theme.spacing(2)};
  transform: none;
  cursor: default;
`

const Tick = styled.div`
  top: ${({ theme }) => theme.spacing(3)};
`

function PeerIdTooltip({ peerId, children, override = {} }) {
  const [isCopied, setIsCopied] = useState(false)
  const rootNodeRef = useContext(RootNodeContext)

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

  const copyPeerId = () => {
    copyToClipboard(peerId)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1750)
  }

  const copyButtonText = isCopied
    ? `Copied "…${getTruncatedPeerId(peerId)}"`
    : 'COPY PEER ID'

  return (
    <Tooltip
      side="right"
      containerRef={rootNodeRef}
      override={{ Positioner, Tick, ...override }}
      content={
        <>
          <StyledButton
            isActive={isCopied}
            onClick={copyPeerId}
            as={override.StyledButton}
          >
            {copyButtonText}
          </StyledButton>
          <SegmentedPeerId as={override.StyledButton}>
            {peerIdSegments}
          </SegmentedPeerId>
        </>
      }
    >
      {children}
    </Tooltip>
  )
}

PeerIdTooltip.propTypes = {
  peerId: T.string.isRequired,
  children: T.node,
}

export default PeerIdTooltip
