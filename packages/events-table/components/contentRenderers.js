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
  value: T.string.isRequired,
  children: T.node,
}

function NullHandler({ children, value }) {
  return value === null ? '' : children
}
NullHandler.propTypes = rendererPropType

function RenderAsString({ value }) {
  return <NullHandler value={value}>{JSON.stringify(value)}</NullHandler>
}
RenderAsString.propTypes = rendererPropType

function RenderPeerId({ value }) {
  return (
    <NullHandler value={value}>
      <PeerIdChip peerId={value} />
    </NullHandler>
  )
}
RenderPeerId.propTypes = rendererPropType

function RenderTime({ value }) {
  return (
    <NullHandler value={value}>
      <Nowrap>{timeFormatter(value)}</Nowrap>
    </NullHandler>
  )
}
RenderTime.propTypes = rendererPropType

export { RenderAsString, RenderPeerId, RenderTime }
