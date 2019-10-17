import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { childrenToString } from '../utils/helpers'

const StyledSpan = styled.span`
  font-family: plex-mono;
  display: inline-block;
`

// TODO: render a peer avatar based on the ID

function PeerId({ id, children, onClick }) {
  const truncatedId = id.slice(id.length - 5)

  //TODO: ditch "title" attr and use child node if present to render proper tooltip
  const title = childrenToString(children)

  return (
    <StyledSpan title={title} onClick={onClick}>
      {'…' + truncatedId}
    </StyledSpan>
  )
}

PeerId.propTypes = {
  id: T.string,
  children: T.node,
  onClick: T.func,
}

export default PeerId
