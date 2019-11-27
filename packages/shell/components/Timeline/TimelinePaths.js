import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  SetterContext,
  PeerContext,
  useStackedData,
  useAreaChart,
  getNumericSorter,
} from '@libp2p-observer/sdk'
import { getTrafficChangesByPeer, getTotalTraffic, getPeerIds } from './utils'

const height = 52

const StyledSvg = styled.svg`
  width: 100%;
  height: ${height}px;
`

const StyledPath = styled.path`
  fill: ${({ theme, colorKey, opacity }) =>
    theme.color(colorKey, 'mid', opacity)};
`

function TimelinePaths({ width, dataDirection, colorKey }) {
  const globalPeerId = useContext(PeerContext)
  const { setPeerId } = useContext(SetterContext)
  const flip = dataDirection === 'out'

  const { stackedData, xScale, yScale } = useStackedData({
    keyData: getTrafficChangesByPeer(dataDirection),
    getKeys: getPeerIds,
    getSorter: getNumericSorter,
    mapSorter: getTotalTraffic,
  })

  const pathDefs = useAreaChart({
    stackedData,
    height,
    width,
    xScale,
    yScale,
    flip,
  })

  return (
    <StyledSvg height={height}>
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
  width: T.number.isRequired,
  dataDirection: T.string.isRequired,
  colorKey: T.string.isRequired,
  flip: T.bool,
}

export default TimelinePaths
