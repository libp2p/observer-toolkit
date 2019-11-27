import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { formatTime } from '@libp2p-observer/sdk'

const TicksContainer = styled.div`
  position: relative;
  height: 16px;
  width: 100%;
`

const TickLabel = styled.label`
  position: absolute;
  text-align: center;
  transform: translateX(-50%);
  white-space: nowrap;
  ${({ theme }) => theme.text('label', 'small')}
`

function TimeTicks({ scale }) {
  window.scale = scale

  const ticks = scale.ticks()
  const tickGap = ticks[1] - ticks[0]

  const firstTickGap = ticks[0] - scale.domain()[0]
  const lastTickGap = scale.domain()[1] - ticks[ticks.length - 1]

  const totalGapValues =
    firstTickGap + tickGap * (ticks.length - 1) + lastTickGap

  const firstTickOffset = firstTickGap / totalGapValues
  const tickOffset = tickGap / totalGapValues

  const tickOffets = Array(ticks.length)
    .fill()
    .map((_, i) => firstTickOffset + i * tickOffset)

  return (
    <TicksContainer>
      {ticks.map((tick, tickIndex) => (
        <TickLabel
          style={{ left: `${tickOffets[tickIndex] * 100}%` }}
          key={`TimeTick[${tickIndex}]`}
        >
          {formatTime(tick)}
        </TickLabel>
      ))}
    </TicksContainer>
  )
}

TimeTicks.propTypes = {
  scale: T.func.isRequired,
}

export default TimeTicks
