import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { timeFormat } from 'd3'

import { PeerIdChip } from '@libp2p-observer/sdk'

const timeFormatter = timeFormat('%H:%M:%S.%L')

const Nowrap = styled.span`
  white-space: nowrap;
`

const rendererPropType = {
  content: T.string.isRequired,
  type: T.string, // Event type
}

function RenderAsString({ content }) {
  return JSON.stringify(content)
}
RenderAsString.propTypes = rendererPropType

function RenderPeerId({ content }) {
  return <PeerIdChip peerId={content} />
}
RenderPeerId.propTypes = rendererPropType

function RenderTime({ content }) {
  return <Nowrap>{timeFormatter(content)}</Nowrap>
}
RenderTime.propTypes = rendererPropType

export { RenderAsString, RenderPeerId, RenderTime }
