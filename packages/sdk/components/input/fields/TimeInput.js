import React from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

function splitTime(timestamp) {
  const time = new Date(timestamp)
  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  return [hours, minutes, seconds]
}

const TimeInputContainer = styled.span``

const TimeInputField = styled.input`
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

const second = 1000
const minute = second * 60
const hour = minute * 60

function TimeInput({
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
  const [hours, minutes, seconds] = splitTime(value)

  const [defaultHours, defaultMinutes, defaultSeconds] = splitTime(defaultValue)

  const handleHours = e => changeTime(e.target.value, 'setHours')
  const handleMinutes = e => changeTime(e.target.value, 'setMinutes')
  const handleSeconds = e => changeTime(e.target.value, 'setSeconds')

  const changeTime = (timeValue, setterName) => {
    const time = new Date(value)
    const newTimestamp = time[setterName](timeValue)
    updateValue(newTimestamp)
  }

  const isHourDisabled =
    max &&
    min + hour > max &&
    new Date(min).getHours() === new Date(max).getHours()
  const isMinutesDisabled =
    max &&
    min + minute > max &&
    new Date(min).getMinutes() === new Date(max).getMinutes()
  const isSecondsDisabled =
    max &&
    min + second > max &&
    new Date(min).getSeconds() === new Date(max).getSeconds()

  return (
    <TimeInputContainer ref={ref} as={override.TimeInputContainer}>
      <TimeInputField
        type="number"
        name="hours"
        isDefault={hours === defaultHours}
        value={hours}
        onChange={handleHours}
        onBlur={onBlur}
        min={0}
        max={24}
        disabled={isHourDisabled}
        as={override.TimeInputField}
      />
      :
      <TimeInputField
        type="number"
        name="minutes"
        isDefault={minutes === defaultMinutes}
        value={minutes}
        onChange={handleMinutes}
        onBlur={onBlur}
        min={0}
        max={60}
        disabled={isMinutesDisabled}
        as={override.TimeInputField}
      />
      :
      <TimeInputField
        type="number"
        name="seconds"
        isDefault={seconds === defaultSeconds}
        value={seconds}
        onChange={handleSeconds}
        onBlur={onBlur}
        min={0}
        max={60}
        disabled={isSecondsDisabled}
        as={override.TimeInputField}
      />
    </TimeInputContainer>
  )
}

TimeInput.propTypes = {
  updateValue: T.func.isRequired,
  value: T.number,
  defaultValue: T.number,
  onBlur: T.func,
  ref: T.object,
  min: T.number,
  max: T.number,
  override: T.object,
}

export default TimeInput
