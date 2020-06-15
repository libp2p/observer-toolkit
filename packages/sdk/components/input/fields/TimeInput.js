import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import uniqueId from 'lodash.uniqueid'

function splitTime(timestamp) {
  const time = new Date(timestamp)
  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const ms = time.getMilliseconds()
  return [hours, minutes, seconds, ms]
}

const TimeInputContainer = styled.span``

const TimeInputField = styled.input`
  text-align: right;
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
  includeHours = true,
  includeMinutes = true,
  includeSeconds = true,
  includeMs = false,
  textLabels = false,
  override = {},
  ...props
}) {
  const [id] = useState(() => uniqueId('TimeInput_'))
  const [hours, minutes, seconds, ms] = splitTime(value)

  const [defaultHours, defaultMinutes, defaultSeconds, defaultMs] = splitTime(
    defaultValue
  )

  const handleHours = e => changeTime(e.target.value, 'setHours')
  const handleMinutes = e => changeTime(e.target.value, 'setMinutes')
  const handleSeconds = e => changeTime(e.target.value, 'setSeconds')
  const handleMs = e => changeTime(e.target.value, 'setMilliseconds')

  const changeTime = (timeValue, setterName) => {
    const time = new Date(value)
    const newTimestamp = time[setterName](timeValue)
    updateValue(newTimestamp)
  }

  // 'Disabled' meaning visible but greyed out because currently out of bounds
  const isHourDisabled =
    includeHours &&
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
  const isMsDisabled =
    includeMs &&
    max &&
    min + 1 > max &&
    new Date(min).getMilliseconds() === new Date(max).getMilliseconds()

  return (
    <TimeInputContainer ref={ref} as={override.TimeInputContainer}>
      {includeHours && (
        <TimeInputField
          id={`${id}_hours`}
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
      )}
      {includeHours &&
        (textLabels ? (
          <Label htmlFor={`${id}_hours`}>hours</Label>
        ) : (
          includeMinutes && ':'
        ))}
      {includeMinutes && (
        <TimeInputField
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
          as={override.TimeInputField}
        />
      )}
      {includeMinutes &&
        (textLabels ? (
          <Label htmlFor={`${id}_minutes`}>minutes</Label>
        ) : (
          includeSeconds && ':'
        ))}
      {includeSeconds && (
        <TimeInputField
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
          as={override.TimeInputField}
        />
      )}
      {includeSeconds &&
        (textLabels ? (
          <Label htmlFor={`${id}_seconds`}>seconds</Label>
        ) : (
          includeMs && ':'
        ))}
      {includeMs && (
        <TimeInputField
          id={`${id}_ms`}
          type="number"
          name="ms"
          isDefault={ms === defaultMs}
          value={ms}
          onChange={handleMs}
          onBlur={onBlur}
          min={0}
          max={1000}
          disabled={isMsDisabled}
          as={override.TimeInputField}
        />
      )}
      {includeMs && textLabels && <Label htmlFor={`${id}_ms`}>ms</Label>}
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
  includeHours: T.bool,
  includeMinutes: T.bool,
  includeSeconds: T.bool,
  includeMs: T.bool,
  textLabels: T.bool,
  override: T.object,
}

export default TimeInput
