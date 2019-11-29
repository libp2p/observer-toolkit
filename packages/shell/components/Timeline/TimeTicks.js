import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { formatTime } from '@libp2p-observer/sdk'
import { getTickOffsets } from './utils'

const TicksContainer = styled.div`
  position: relative;
  height: 18px;
  width: 100%;
`

const TickLabel = styled.label`
  position: absolute;
  text-align: center;
  transform: translateX(-50%);
  white-space: nowrap;
  ${({ theme }) => theme.text('label', 'small')}
`

function TimeTicks({ scale, width }) {
  const ticks = scale.ticks(Math.round(width / 120))
  const tickOffsets = getTickOffsets(ticks, scale)

  return (
    <TicksContainer>
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
}

export default TimeTicks
