import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { formatDataSize, formatDuration, formatTime } from '../../utils/formats'

const Monospace = styled.span`
  font-family: plex-mono;
`

const Nowrap = styled.span`
  white-space: nowrap;
`

const NumWrapper = styled.span`
  font-family: 'plex-mono';
  white-space: nowrap;
`

const Unit = styled.span`
  font-family: 'plex-sans';
  font-weight: 300;
  font-size: 90%;
  min-width: ${({ theme }) => theme.spacing(2)};
  display: inline-block;
  text-align: left;
`

function FormatedNumber({ value, unit = '' }) {
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
      {value} <Unit>{unit || ''}</Unit>
    </NumWrapper>
  )
}
FormatedNumber.propTypes = {
  value: T.oneOfType([T.number, T.string]).isRequired,
  unit: T.string,
}

function SecondsNumber({ value }) {
  return <FormatedNumber value={value} unit="s" />
}
SecondsNumber.propTypes = {
  value: T.number.isRequired,
}

function DataNumber({ value }) {
  const [formattedValue, unit] = formatDataSize(value)
  return <FormatedNumber value={formattedValue} unit={unit} />
}
DataNumber.propTypes = {
  value: T.number.isRequired,
}

function TimeNumber({ value, includeMs }) {
  const time = formatTime(value, includeMs)
  return <NumWrapper>{time}</NumWrapper>
}
TimeNumber.propTypes = {
  value: T.number.isRequired,
  includeMs: T.bool,
}

function DurationNumber({ value, maxUnits = 2, shortForm = true }) {
  return <Nowrap>{formatDuration(value, maxUnits, shortForm)}</Nowrap>
}
DurationNumber.propTypes = {
  value: T.number.isRequired,
  maxUnits: T.number,
  shortForm: T.bool,
}

export {
  DataNumber,
  DurationNumber,
  SecondsNumber,
  FormatedNumber,
  TimeNumber,
  Monospace,
  Nowrap,
  NumWrapper,
}
