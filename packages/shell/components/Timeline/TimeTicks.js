import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { formatTime } from '@libp2p-observer/sdk'
import { getTickOffsets } from './utils'

const TicksContainer = styled.div`
  position: relative;
  height: 18px;
  width: ${({ width }) => width}px;
  margin-left: ${({ leftOffset }) => leftOffset}px;
  display: flex;
  align-items: center;
  z-index: 4;
  pointer-events: none;
`

const TickLabel = styled.label`
  position: absolute;
  text-align: center;
  transform: translateX(-50%);
  white-space: nowrap;
  ${({ theme }) => theme.text('label', 'small')}
`

function TimeTicks({ scale, width, leftOffset = 0 }) {
  const ticks = scale.ticks(Math.round(width / 120))
  const tickOffsets = getTickOffsets(ticks, scale)

  return (
    <TicksContainer leftOffset={leftOffset} width={width}>
      {ticks.map((tick, tickIndex) => (
        <TickLabel
          style={{ left: `${tickOffsets[tickIndex] * 100}%` }}
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
  width: T.number.isRequired,
  leftOffset: T.number,
}

export default TimeTicks
