import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import uniqueId from 'lodash.uniqueid'

const hourInMs = 1000 * 60 * 60
const minuteInMs = 1000 * 60
const secondInMs = 1000

function splitDuration(value) {
  let rollingValue = value
  const hours = Math.floor(rollingValue / hourInMs)
  if (rollingValue > hours * hourInMs) rollingValue -= hours * hourInMs

  const mins = Math.floor(rollingValue / minuteInMs)
  if (rollingValue > mins * minuteInMs) rollingValue -= mins * minuteInMs

  const secs = Math.floor(rollingValue / secondInMs)
  if (rollingValue > secs * secondInMs) rollingValue -= secs * secondInMs

  const ms = Math.round(rollingValue)
  return [hours, mins, secs, ms]
}

function unsplitDuration([hours, mins, secs, ms]) {
  return hours * hourInMs + mins * minuteInMs + secs * secondInMs + ms
}

const DurationInputContainer = styled.span``

const DurationInputField = styled.input`
  text-align: right;
  max-width: ${({ theme }) => theme.spacing(8)};
  font-family: 'plex-mono';
  background: ${({ theme }) => theme.color('background', 1)};
  border: none;
  margin: ${({ theme }) => theme.spacing([1, 0.5])};
  padding: ${({ theme }) => theme.spacing([1, 0.5])};
  font-weight: 400;
  color: ${({ theme, isDefault, disabled }) => {
    if (disabled) return theme.color('text', 2)
    return theme.color(isDefault ? 'text' : 'highlight', 1)
  }};
  :focus {
    font-weight: 800;
  }
`
const Label = styled.label`
  margin-right: ${({ theme }) => theme.spacing(2)};
`

function DurationInput({
  updateValue,
  value = null,
  defaultValue = null,
  onBlur = () => {},
  ref,
  min,
  max,
  override = {},
  ...props
}) {
  const [id] = useState(() => uniqueId('DurationInput_'))
  const [hours, minutes, seconds, ms] = splitDuration(value)

  const [
    defaultHours,
    defaultMinutes,
    defaultSeconds,
    defaultMs,
  ] = splitDuration(defaultValue)

  const handleHours = e =>
    updateDuration([e.target.value, minutes, seconds, ms])
  const handleMinutes = e =>
    updateDuration([hours, e.target.value, seconds, ms])
  const handleSeconds = e =>
    updateDuration([hours, minutes, e.target.value, ms])
  const handleMs = e =>
    updateDuration([hours, minutes, seconds, e.target.value])

  const updateDuration = splitValues => {
    updateValue(unsplitDuration(splitValues))
  }

  // 'Disabled' meaning visible but greyed out because currently out of bounds
  const isHourDisabled = max && min + hourInMs > max
  const isMinutesDisabled = min + minuteInMs > max
  const isSecondsDisabled = min + secondInMs > max

  return (
    <DurationInputContainer ref={ref} as={override.TimeInputContainer}>
      <DurationInputField
        id={`${id}_hours`}
        type="number"
        name="hours"
        isDefault={hours === defaultHours}
        value={hours}
        onChange={handleHours}
        onBlur={onBlur}
        min={0}
        disabled={isHourDisabled}
        as={override.DurationInputField}
      />
      <Label htmlFor={`${id}_hours`}>hours</Label>
      <DurationInputField
        id={`${id}_minutes`}
        type="number"
        name="minutes"
        isDefault={minutes === defaultMinutes}
        value={minutes}
        onChange={handleMinutes}
        onBlur={onBlur}
        min={0}
        max={60}
        disabled={isMinutesDisabled}
        as={override.DurationInputField}
      />
      <Label htmlFor={`${id}_minutes`}>minutes</Label>
      <DurationInputField
        id={`${id}_seconds`}
        type="number"
        name="seconds"
        isDefault={seconds === defaultSeconds}
        value={seconds}
        onChange={handleSeconds}
        onBlur={onBlur}
        min={0}
        max={60}
        disabled={isSecondsDisabled}
        as={override.DurationInputField}
      />
      <Label htmlFor={`${id}_seconds`}>seconds</Label>
      <DurationInputField
        id={`${id}_ms`}
        type="number"
        name="ms"
        isDefault={ms === defaultMs}
        value={ms}
        onChange={handleMs}
        onBlur={onBlur}
        min={0}
        max={1000}
        as={override.DurationInputField}
      />
      <Label htmlFor={`${id}_ms`}>ms</Label>
    </DurationInputContainer>
  )
}

DurationInput.propTypes = {
  updateValue: T.func.isRequired,
  value: T.number,
  defaultValue: T.number,
  onBlur: T.func,
  ref: T.object,
  min: T.number,
  max: T.number,
  override: T.object,
}

export default DurationInput
