import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { SetterContext, PeerContext, useAreaChart } from '@libp2p-observer/sdk'

import DataTicks from './DataTicks'
import TimeTicks from './TimeTicks'

const height = 52

const Container = styled.div`
  position: relative;
  padding: 0;
`

const StyledSvg = styled.svg`
  width: 100%;
  height: ${height}px;
  background: ${({ theme }) => theme.color('contrast', 1)};
`

const StyledPath = styled.path`
  fill: ${({ theme, colorKey, opacity, isHighlighted }) => {
    if (isHighlighted) return theme.color('background', 1)
    return theme.color(colorKey, 0, opacity)
  }};
`

function TimelinePaths({
  width,
  dataDirection,
  colorKey,
  xScale,
  yScale,
  stackedData,
  leftGutter,
}) {
  const globalPeerId = useContext(PeerContext)
  const { setPeerId } = useContext(SetterContext)
  const flip = dataDirection === 'out'

  const pathDefs = useAreaChart({
    stackedData,
    height,
    width,
    xScale,
    yScale,
    flip,
  })

  return (
    <Container>
      <DataTicks
        scale={yScale}
        width={leftGutter}
        height={height}
        dataDirection={dataDirection}
        colorKey={colorKey}
      />
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
                colorKey={colorKey}
                isHighlighted={isHighlighted}
                opacity={
                  (index % 2 ? 0.6 : 0.7) +
                  (index / (pathDefs.length + 1)) * 0.3
                }
              />
            )
          })}
      </StyledSvg>
      {dataDirection === 'in' && <TimeTicks scale={xScale} width={width} />}
    </Container>
  )
}

TimelinePaths.propTypes = {
  width: T.number.isRequired,
  dataDirection: T.string.isRequired,
  colorKey: T.string.isRequired,
  flip: T.bool,
}

export default TimelinePaths
