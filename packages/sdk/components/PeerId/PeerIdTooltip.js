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
  font-weight: 300;
  color: ${({ theme }) => theme.color('text', 1)};
  cursor: text;
  user-select: text;
`

const LastSegment = styled.span`
  font-weight: 500;
`

const Positioner = styled.div`
  top: -${({ theme }) => theme.spacing(2, true)}px;
  transform: none;
  cursor: default;
`

const Tick = styled.div`
  top: ${({ theme, tickSize }) => theme.spacing(2.5, true) + tickSize}px;
`

function getPeerSegment(segmentText, i, isLast) {
  if (!isLast)
    return (
      <span key={`segment-${i}`}>
        {segmentText}
        <wbr />
      </span>
    )

  const truncated = getTruncatedPeerId(segmentText)
  const mainSegment = segmentText.slice(
    0,
    segmentText.length - truncated.length
  )

  return (
    <span key={`segment-${i}`}>
      {mainSegment}
      <LastSegment>{truncated}</LastSegment>
    </span>
  )
}

function PeerIdTooltip({ peerId, children, override = {} }) {
  const [isCopied, setIsCopied] = useState(false)
  const rootNodeRef = useContext(RootNodeContext)

  const segmentsCount = 4
  const segmentsLength = Math.round(peerId.length / segmentsCount) // Usually 64 / 4 = 16
  const peerIdSegments = []
  let i = 0
  while (i < segmentsCount) {
    const isLast = i + 1 === segmentsCount

    const segmentText = peerId.slice(
      segmentsLength * i,
      segmentsLength * (i + 1)
    )
    peerIdSegments.push(getPeerSegment(segmentText, i, isLast))
    if (!isLast) peerIdSegments.push(<wbr key={`break-${i}`} />)

    i++
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
