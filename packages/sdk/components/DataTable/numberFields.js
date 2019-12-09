import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { formatDataSize } from '../../utils/formats'
import { childrenToString } from '../../utils/helpers'

const NumWrapper = styled.span`
  font-family: 'plex-mono';
  font-weight: 500;
  font-size: 10pt;
  white-space: nowrap;
  color: ${({ theme, weightAdjust }) =>
    theme.color('text', 0, weightAdjust / 2000 + 0.5)};
`

const Unit = styled.span`
  // Use cell right padding for units, aligning with icons
  margin-right: -${({ theme }) => theme.spacing()};
  padding-left: ${({ theme }) => theme.spacing()};
  font-family: 'plex-sans';
  font-weight: 300;
  font-size: 9pt;
  width: ${({ theme }) => theme.spacing(4)};
  display: inline-block;
  text-align: left;
`

function FormatedNumber({ value, unit }) {
  if (parseInt(value) === 0) {
    return (
      <NumWrapper>
        {0}
        <Unit />
      </NumWrapper>
    )
  }

  return (
    <NumWrapper>
      {value}
      <Unit>{unit}</Unit>
    </NumWrapper>
  )
}

FormatedNumber.propTypes = {
  value: T.oneOfType([T.number, T.string]).isRequired,
  unit: T.string.isRequired,
}

function TimeNumber({ value }) {
  return <FormatedNumber value={value} unit="s" />
}

TimeNumber.propTypes = {
  value: T.number.isRequired,
}

function DataNumber({ value }) {
  const [formattedValue, unit] = formatDataSize(value)
  return <FormatedNumber value={formattedValue} unit={unit} />
}

DataNumber.propTypes = {
  value: T.number.isRequired,
}

export { TimeNumber, DataNumber }
