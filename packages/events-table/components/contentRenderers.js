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
`

const rendererPropType = {
  value: T.oneOfType([T.number, T.string]).isRequired,
  type: T.string, // Event type
}

function RenderString({ value }) {
  return value
}
RenderString.propTypes = rendererPropType

function RenderNumber({ value }) {
  return value
}
RenderNumber.propTypes = rendererPropType

function RenderJson({ value }) {
  return value ? <RawJson>{value}</RawJson> : ''
}
RenderJson.propTypes = rendererPropType

function RenderPeerId({ value }) {
  return value ? <PeerIdChip peerId={value} /> : ''
}
RenderPeerId.propTypes = rendererPropType

function RenderTime({ value }) {
  return value ? <Nowrap>{timeFormatter(value)}</Nowrap> : ''
}
RenderTime.propTypes = rendererPropType

export { RenderString, RenderJson, RenderPeerId, RenderTime, RenderNumber }
