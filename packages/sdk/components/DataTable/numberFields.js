import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { childrenToString } from '../utils/helpers'

function FormatedNumber({ value, units, initialWeight = 0, children }) {
  const Unit = styled.span`
    // Use cell right padding for units, aligning with icons
    width: ${({ theme }) => theme.spacing(4)};
    margin-right: -${({ theme }) => theme.spacing(4)};
    padding-left: ${({ theme }) => theme.spacing(2)};
    display: inline-block;
    text-align: left;
  `
  //TODO: ditch "title" attr and use child node if present to render proper tooltip
  const title = childrenToString(children)

  if (value === 0)
    return (
      <span title={title}>
        {0}
        <Unit />
      </span>
    )

  const unitEntries = Object.entries(units).sort(
    (a, b) => (a[1] > b[1] && -1) || a[1] < b[1]
  )

  const unitIndex = unitEntries.findIndex(([_, divider]) => value >= divider)
  const [unit, divider] = unitEntries[unitIndex]

  const formattedValue = `${(value / divider).toFixed(2)}`

  const weightAdjust = (unitEntries.length - unitIndex) * 200

  const NumWrapper = styled.span`
    font-weight: ${initialWeight + weightAdjust};
    white-space: nowrap;
    color: ${({ theme }) =>
      theme.color('dark', 'dark', weightAdjust / 2000 + 0.5)};
  `

  return (
    <NumWrapper title={title}>
      {formattedValue}
      <Unit>{unit}</Unit>
    </NumWrapper>
  )
}

FormatedNumber.propTypes = {
  value: T.number.isRequired,
  units: T.object.isRequired,
  initialWeight: T.number,
  children: T.any,
}

function TimeNumber({ value, children }) {
  // Makes miliseconds more readable

  const ms = 1
  const s = ms * 1000
  const mins = s * 60
  const hrs = mins * 60
  const days = hrs * 24

  return (
    <FormatedNumber value={value} units={{ ms, s, mins, hrs, days }}>
      {children}
    </FormatedNumber>
  )
}

TimeNumber.propTypes = {
  value: T.number.isRequired,
  children: T.any,
}

function DataNumber({ value, children }) {
  const bytes = 1
  const kb = bytes * 1000
  const mb = kb * 1000
  const gb = mb * 1000
  const tb = gb * 1000

  return (
    <FormatedNumber value={value} units={{ bytes, kb, mb, gb, tb }}>
      {children}
    </FormatedNumber>
  )
}

DataNumber.propTypes = {
  value: T.number.isRequired,
  children: T.any,
}

export { TimeNumber, DataNumber }
