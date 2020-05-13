import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  SetterContext,
  PeersContext,
  useAreaChart,
} from '@nearform/observer-sdk'

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

const StyledPath = styled.path.attrs(
  ({ theme, colorKey, opacity, highlighted }) => ({
    'data-highlighted': highlighted ? true : null,
    fill: highlighted
      ? theme.color('background', 1)
      : theme.color(colorKey, 0, opacity),
  })
)``

function TimelinePaths({
  width,
  dataDirection,
  colorKey,
  xScale,
  yScale,
  stackedData,
  leftGutter,
}) {
  const globalPeerIds = useContext(PeersContext)
  const { setPeerIds } = useContext(SetterContext)
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
          pathDefs.map(({ pathDef, key }, index) => {
            const peerId = key.split('_')[0]
            const highlighted = globalPeerIds.includes(peerId)

            function mouseEnterHandler() {
              if (!globalPeerIds.includes(peerId)) setPeerIds([peerId])
            }
            function mouseLeaveHandler() {
              if (globalPeerIds.length) setPeerIds([])
            }

            return (
              <StyledPath
                key={key}
                d={pathDef}
                name={peerId}
                onMouseEnter={mouseEnterHandler}
                onMouseLeave={mouseLeaveHandler}
                colorKey={colorKey}
                highlighted={highlighted}
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
  xScale: T.func.isRequired,
  yScale: T.func.isRequired,
  stackedData: T.array.isRequired,
  leftGutter: T.number.isRequired,
}

export default TimelinePaths
