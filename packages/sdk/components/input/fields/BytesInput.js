import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import uniqueId from 'lodash.uniqueid'

const gbInBytes = 1000 * 1000 * 1000
const mbInBytes = 1000 * 1000
const kbInBytes = 1000

function splitBytes(value) {
  let rollingValue = value
  const gb = Math.floor(rollingValue / gbInBytes)
  if (rollingValue > gb * gbInBytes) rollingValue -= gb * gbInBytes

  const mb = Math.floor(rollingValue / mbInBytes)
  if (rollingValue > mb * mbInBytes) rollingValue -= mb * mbInBytes

  const kb = Math.floor(rollingValue / kbInBytes)
  if (rollingValue > kb * kbInBytes) rollingValue -= kb * kbInBytes

  const bytes = Math.round(rollingValue)
  return [gb, mb, kb, bytes]
}

function unsplitBytes([gb, mb, kb, bytes]) {
  return gb * gbInBytes + mb * mbInBytes + kb + kbInBytes + bytes
}

const BytesInputContainer = styled.span``

const BytesInputField = styled.input`
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

function BytesInput({
  updateValue,
  value = null,
  defaultValue = null,
  onBlur = () => {},
  ref,
  min,
  max,
  textLabels = false,
  override = {},
  ...props
}) {
  const [id] = useState(() => uniqueId('BytesInput_'))
  const [gb, mb, kb, bytes] = splitBytes(value)

  const [defaultGb, defaultMb, defaultKb, defaultBytes] = splitBytes(
    defaultValue
  )

  const handleGb = e => updateBytes([e.target.value, mb, kb, bytes])
  const handleMb = e => updateBytes([gb, e.target.value, kb, bytes])
  const handleKb = e => updateBytes([gb, mb, e.target.value, bytes])
  const handleBytes = e => updateBytes([gb, mb, kb, e.target.value])

  const updateBytes = splitValues => {
    updateValue(unsplitBytes(splitValues))
  }

  // 'Disabled' meaning visible but greyed out because currently out of bounds
  const isGbDisabled = max && min + gbInBytes > max
  const isMbDisabled = max && min + mbInBytes > max
  const isKbDisabled = max && min + kbInBytes > max

  return (
    <BytesInputContainer ref={ref} as={override.TimeInputContainer}>
      <BytesInputField
        id={`${id}_gb`}
        type="number"
        name="gb"
        isDefault={gb === defaultGb}
        value={gb}
        onChange={handleGb}
        onBlur={onBlur}
        min={0}
        size={5}
        disabled={isGbDisabled}
        as={override.BytesInputField}
      />
      <Label htmlFor={`${gb}_hours`}>gb</Label>
      <BytesInputField
        id={`${id}_mb`}
        type="number"
        name="mb"
        isDefault={mb === defaultMb}
        value={mb}
        onChange={handleMb}
        onBlur={onBlur}
        min={0}
        max={1000}
        disabled={isMbDisabled}
        as={override.BytesInputField}
      />
      <Label htmlFor={`${id}_mb`}>mb</Label>
      <BytesInputField
        id={`${id}_kb`}
        type="number"
        name="kb"
        isDefault={kb === defaultKb}
        value={kb}
        onChange={handleKb}
        onBlur={onBlur}
        min={0}
        max={1000}
        disabled={isKbDisabled}
        as={override.BytesInputField}
      />
      <Label htmlFor={`${id}_bytes`}>kb</Label>
      <BytesInputField
        id={`${id}_bytes`}
        type="number"
        name="bytes"
        isDefault={bytes === defaultBytes}
        value={bytes}
        onChange={handleBytes}
        onBlur={onBlur}
        min={0}
        max={1000}
        as={override.BytesInputField}
      />
      <Label htmlFor={`${id}_bytes`}>bytes</Label>
    </BytesInputContainer>
  )
}

BytesInput.propTypes = {
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

export default BytesInput
