import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { SetterContext, PeerContext } from '../DataProvider'

function TimelinePaths({ pathDefs, svgHeight, colorKey }) {
  const globalPeerId = useContext(PeerContext)
  const { setPeerId } = useContext(SetterContext)

  const StyledSvg = styled.svg`
    width: 100%;
    height: ${svgHeight}px;
  `

  return (
    <StyledSvg>
      {pathDefs.map(({ pathDef, peerId }, index) => {
        const isHighlighted = peerId === globalPeerId

        function mouseEnterHandler() {
          if (peerId !== globalPeerId) setPeerId(peerId)
        }
        function mouseLeaveHandler() {
          if (globalPeerId) setPeerId(null)
        }

        const StyledPath = styled.path.attrs({
          d: pathDef,
          name: peerId,
        })`
          fill: ${({ theme }) =>
            theme.color(
              isHighlighted ? 'tertiary' : colorKey,
              'mid',
              index % 2 ? 0.6 : 0.8
            )};
        `
        const key = `${peerId}_paths`
        return (
          <StyledPath
            key={key}
            onMouseEnter={mouseEnterHandler}
            onMouseLeave={mouseLeaveHandler}
          />
        )
      })}
    </StyledSvg>
  )
}

TimelinePaths.propTypes = {
  pathDefs: T.array.isRequired,
  svgHeight: T.number.isRequired,
  colorKey: T.string.isRequired,
}

export default TimelinePaths
