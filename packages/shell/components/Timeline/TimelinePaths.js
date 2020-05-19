import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  DataContext,
  SetterContext,
  PeersContext,
  useAreaChart,
} from '@libp2p-observer/sdk'
import { getStateRangeTimes } from '@libp2p-observer/data'
import { getStateWidth } from './utils'

import DataTicks from './DataTicks'
import TimeTicks from './TimeTicks'

const height = 52

const Container = styled.div`
  position: relative;
  :after {
    content: '';
    display: block;
    position: absolute;
    height: ${({ innerHeight }) => innerHeight}px;
    top: 0;
    /* +/- 2 to make sure no partial pixel edges show through */
    left: ${({ state0Width }) => state0Width - 2}px;
    width: ${({ state1Width }) => state1Width + 2}px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.color('contrast', 1)},
      transparent
    );
    mix-blend-mode: darken;
  }
`

const StyledSvg = styled.svg`
  width: 100%;
  height: 100%;
`

const InnerContainer = styled.div`
  height: ${height}px;
  background: ${({ theme }) => theme.color('contrast', 1)};
  padding: 0 0 0 ${({ state0Width }) => state0Width}px;
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
  const states = useContext(DataContext)
  const globalPeerIds = useContext(PeersContext)
  const { setPeerIds } = useContext(SetterContext)
  const flip = dataDirection === 'out'

  const { duration: overallDuration } = getStateRangeTimes(states)
  const state0Width = getStateWidth(states[0], overallDuration, width)
  const state1Width = getStateWidth(states[1], overallDuration, width)
  const pathWidth = width - state0Width

  const pathDefs = useAreaChart({
    stackedData,
    height,
    width: pathWidth,
    xScale,
    yScale,
    flip,
  })

  return (
    <Container
      innerHeight={height}
      state0Width={state0Width}
      state1Width={state1Width}
    >
      <DataTicks
        scale={yScale}
        width={leftGutter}
        height={height}
        dataDirection={dataDirection}
        colorKey={colorKey}
      />
      <InnerContainer height={height} state0Width={state0Width}>
        <StyledSvg>
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
      </InnerContainer>
      {dataDirection === 'in' && (
        <TimeTicks scale={xScale} width={pathWidth} leftOffset={state0Width} />
      )}
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
