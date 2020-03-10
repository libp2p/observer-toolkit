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

function RenderJsonString({ content }) {
  // simplified without parsing
  const value = content.replace('{"', '","').replace('"}', '","')
  const items = value.split('","').map(v => {
    const kv = v.split('":"')
    return kv.length === 2 ? (
      <span>
        <b>{kv[0]}: </b>
        {kv[1]}&nbsp;
      </span>
    ) : (
      ''
    )
  })
  return <>{items}</>
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
