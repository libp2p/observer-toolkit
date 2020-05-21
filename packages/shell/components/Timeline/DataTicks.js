import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { formatDataSize } from '@nearform/observer-sdk'
import { getTickOffsets } from './utils'

const TicksContainer = styled.div`
  position: absolute;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  left: -${({ width }) => width}px;
  top: 0;
`

const TickLabel = styled.label`
  position: absolute;
  right: ${({ theme }) => theme.spacing(1)};
  text-align: right;
  white-space: nowrap;
  transform: translateY(
    ${({ fromSide }) => (fromSide === 'top' ? '-50%' : '50%')}
  );
  color: ${({ theme, colorKey }) => theme.color(colorKey)};
  ${({ theme }) => theme.text('label', 'small')}
`

const TickValue = styled.span`
  font-weight: 600;
`

const TickUnit = styled.span`
  font-weight: 400;
`

const AxisLabel = styled.label`
  display: block;
  position: absolute;
  font-weight: 800;
  text-align: right;
  transform-origin: top right;
  transform: rotate(-90deg);
  width: 100%;
  text-transform: uppercase;
  top: -${({ theme }) => theme.spacing(0.5)};
  padding-top: ${({ theme }) => theme.spacing(1)};
  right: ${({ width }) => width}px;
  color: ${({ theme, colorKey }) => theme.color(colorKey)};
  ${({ theme }) => theme.text('label', 'medium')}
`

const nbsp = '\u00A0'

function DataTicks({ scale, height, width, dataDirection, colorKey }) {
  let ticks = scale.ticks(3)
  if (ticks.length > 5) {
    const topTick = ticks[ticks.length - 1]
    ticks = [0, topTick / 2, topTick]
  }

  const tickOffsets = getTickOffsets(ticks, scale)
  const fromSide = dataDirection === 'in' ? 'bottom' : 'top'

  let lowestTickUnitPair = ['', Infinity]
  const ticksFormatted = ticks.map(tickValue => {
    const [formattedValue, unit] = formatDataSize(tickValue)
    if (unit && tickValue < lowestTickUnitPair[1]) {
      lowestTickUnitPair = [unit, tickValue]
    }
    return [formattedValue, unit]
  })

  return (
    <TicksContainer height={height} width={width}>
      <AxisLabel colorKey={colorKey} width={width}>
        Data {dataDirection}
      </AxisLabel>
      {ticksFormatted.map(([tickValue, unit], tickIndex) => (
        <TickLabel
          style={{ [fromSide]: `${tickOffsets[tickIndex] * 100}%` }}
          fromSide={fromSide}
          key={`TimeTick[${tickIndex}]`}
          colorKey={colorKey}
        >
          <TickValue>{tickValue}</TickValue>
          {nbsp}
          <TickUnit>{unit || lowestTickUnitPair[0]}</TickUnit>
        </TickLabel>
      ))}
    </TicksContainer>
  )
}

DataTicks.propTypes = {
  scale: T.func.isRequired,
  height: T.number.isRequired,
  width: T.number.isRequired,
  dataDirection: T.string.isRequired,
  colorKey: T.string.isRequired,
}

export default DataTicks
