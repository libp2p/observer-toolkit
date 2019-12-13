import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { getTruncatedPeerId } from './utils'

const TextStyle = styled.span`
  font-family: plex-mono;
  display: inline-block;
  white-space: nowrap;
`

function PeerIdTruncated({ peerId }) {
  const truncatedId = getTruncatedPeerId(peerId)
  return <TextStyle>{truncatedId}</TextStyle>
}

PeerIdTruncated.propTypes = {
  peerId: T.string.isRequired,
}

export default PeerIdTruncated
