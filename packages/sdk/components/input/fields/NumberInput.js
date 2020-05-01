import React, { useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import TimeInput from './TimeInput'
import Icon from '../../Icon'

const NumberInputField = styled.input`
  font-family: 'plex-mono';
  background: ${({ theme }) => theme.color('background', 1)};
  border: none;
  margin: ${({ theme }) => theme.spacing()};
  padding: ${({ theme }) => theme.spacing()};
  font-weight: 400;
  color: ${({ theme, isDefault }) =>
    theme.color(isDefault ? 'text' : 'highlight', 1)};
  :focus {
    font-weight: 800;
  }
`

const NumberFieldWrapper = styled.span`
  display: inline-block;
  position: relative;
  white-space: nowrap;
`

const NumberLabel = styled.label`
  padding: ${({ theme }) => theme.spacing(0.5)};
`

const FormattedValue = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing(-1)};
  ${({ theme }) => theme.text('label', 'medium')};
  color: ${({ theme }) => theme.color('text', 2)};
  font-weight: 300;
  width: 100%;
  text-align: center;
`

function NumberInput({
  label,
  value = null,
  defaultValue = null,
  type = 'number',
  setFieldValue,
  getValidatedValue = value => [value, true],
  format = null,
  override,
  ...props
}) {
  const [displayValue, setDisplayValue] = useState(value || defaultValue)
  const inputRef = useRef()

  const isValueManagedByParent = !!setFieldValue

  const updateValue = value => {
    if (isValueManagedByParent) {
      updateManagedValue(value)
    } else {
      const newValue = value === '' ? defaultValue : value
      setDisplayValue(newValue)
    }
  }

  const updateManagedValue = value => {
    // Send validated value to handler passed in by parent
    const [validValue, wasValid] = getValidatedValue(value)

    setFieldValue(validValue)

    // Allow input to display invalid numbers while user types
    const isInFocus = document.activeElement === inputRef.current
    if (isInFocus) {
      const newDisplayValue = wasValid ? defaultValue : value
      setDisplayValue(newDisplayValue)
    }
  }

  const handleChange = event => {
    const value = parseFloat(event.target.value)

    if (isNaN(value)) {
      setDisplayValue('')
    } else {
      updateValue(value)
    }
  }

  const handleBlur = () => {
    if (isValueManagedByParent) setDisplayValue(defaultValue)
  }

  const fieldValue = displayValue === defaultValue ? value : displayValue
  const isDefault = fieldValue === defaultValue

  const hasFormattedValue = !!format && typeof fieldValue === 'number'

  return (
    <NumberFieldWrapper as={override.NumberLabelWrapper}>
      {label && <NumberLabel as={override.NumberLabel}>{label}</NumberLabel>}
      {(type === 'number' && (
        <>
          <NumberInputField
            type="number"
            ref={inputRef}
            isDefault={isDefault}
            value={fieldValue}
            onChange={handleChange}
            onBlur={handleBlur}
            as={override.NumberInputField}
            {...props}
          />
          {hasFormattedValue && (
            <FormattedValue>{format(fieldValue, 2)}</FormattedValue>
          )}
        </>
      )) ||
        (type === 'time' && (
          <TimeInput
            value={fieldValue}
            onBlur={handleBlur}
            updateValue={updateValue}
            as={override.NumberInputField}
            {...props}
          />
        ))}
      <Icon
        type="cancel"
        onClick={() => updateValue(defaultValue)}
        active={!isDefault}
        disabled={isDefault}
      />
    </NumberFieldWrapper>
  )
}

NumberInput.propTypes = {
  label: T.string,
  value: T.oneOfType([T.number, T.string]), // '' if empty field value
  defaultValue: T.number,
  type: T.string,
  setFieldValue: T.func,
  getValidatedValue: T.func,
  format: T.func,
  override: T.object,
}

export default NumberInput
