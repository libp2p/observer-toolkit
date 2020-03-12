import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { timeFormat } from 'd3'

import { PeerIdChip } from '@libp2p-observer/sdk'

const timeFormatter = timeFormat('%H:%M:%S.%L')

const Nowrap = styled.span`
  white-space: nowrap;
`

const RawJson = styled.pre`
  padding: ${({ theme }) => theme.spacing(0.5)};
  background: ${({ theme }) => theme.color('background', 1)};
  font-family: 'plex-mono';
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  position: relative;
  text-overflow: ellipsis;
`

const rendererPropType = {
  content: T.string.isRequired,
  type: T.string, // Event type
}

function RenderAsString({ content }) {
  return JSON.stringify(content)
}
RenderAsString.propTypes = rendererPropType

function RenderJsonString({ content }) {
  return <RawJson>{content}</RawJson>
}
RenderJsonString.propTypes = rendererPropType

function RenderPeerId({ content }) {
  return <PeerIdChip peerId={content} />
}
RenderPeerId.propTypes = rendererPropType

function RenderTime({ content }) {
  return <Nowrap>{timeFormatter(content)}</Nowrap>
}
RenderTime.propTypes = rendererPropType

export { RenderAsString, RenderJsonString, RenderPeerId, RenderTime }
