import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { SetterContext, PeerContext } from '@libp2p-observer/sdk'

const StyledSvg = styled.svg`
  width: 100%;
  height: ${({ svgHeight }) => svgHeight}px;

  // TODO: make this less hacky, adjust in path defs
  margin-bottom: -4px;
`

const StyledPath = styled.path`
  fill: ${({ theme, colorKey, opacity }) =>
    theme.color(colorKey, 'mid', opacity)};
`

function TimelinePaths({ pathDefs, svgHeight, colorKey }) {
  const globalPeerId = useContext(PeerContext)
  const { setPeerId } = useContext(SetterContext)

  return (
    <StyledSvg svgHeight={svgHeight}>
      {pathDefs &&
        pathDefs.map(({ pathDef, peerId }, index) => {
          const isHighlighted = peerId === globalPeerId

          function mouseEnterHandler() {
            if (peerId !== globalPeerId) setPeerId(peerId)
          }
          function mouseLeaveHandler() {
            if (globalPeerId) setPeerId(null)
          }

          const key = `${peerId}_paths`
          return (
            <StyledPath
              key={key}
              d={pathDef}
              name={peerId}
              onMouseEnter={mouseEnterHandler}
              onMouseLeave={mouseLeaveHandler}
              colorKey={isHighlighted ? 'tertiary' : colorKey}
              opacity={
                (index % 2 ? 0.6 : 0.7) + (index / (pathDefs.length + 1)) * 0.3
              }
            />
          )
        })}
    </StyledSvg>
  )
}

TimelinePaths.propTypes = {
  pathDefs: T.array,
  svgHeight: T.number.isRequired,
  colorKey: T.string.isRequired,
}

export default TimelinePaths
