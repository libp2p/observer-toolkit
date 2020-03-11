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
  try {
    const json = JSON.parse(content)
    const items = Object.keys(json)
      .sort()
      .map(key => {
        const value =
          typeof json[key] === 'string' ||
          typeof json[key] === 'number' ||
          typeof json[key] === 'boolean'
            ? json[key]
            : typeof json[key]
        return (
          <span key={key}>
            <b>{key}: </b>
            {value}&nbsp;
          </span>
        )
      })
    return <>{items}</>
  } catch (error) {
    return ''
  }
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
