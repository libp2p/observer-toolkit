import React, { useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Field } from 'formik'

import { calculatableProp } from '../../../utils/helpers'
import Icon from '../../Icon'
import Tooltip from '../../Tooltip'

const CONTROL_WIDTH = 16
const BAR_HEIGHT = 8
const WIDTH = 340

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing([3, 2, 0])};
  user-select: none;
  width: ${({ width }) => width}px;
`

const Bar = styled.div`
  background: ${({ theme }) => theme.color('background')};
  border-radius: ${({ theme }) => theme.spacing()};
  border: 2px solid ${({ theme }) => theme.color('background', 2)};
  height: ${BAR_HEIGHT}px;
  display: flex;
  position: relative;
  cursor: pointer;
`

const ActiveSection = styled.div`
  flex-grow: 1;
  background: ${({ theme }) => theme.color('background', 1)};
  height: 100%;
  border-radius: ${({ theme }) => theme.spacing()};
  user-select: none;
`
const InactiveSection = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.color('highlight', 0)};
  user-select: none;
`

const Control = styled.div`
  position: absolute;
  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;
  margin-top: -${BAR_HEIGHT / 2 + 2}px;
  border-radius: ${({ width, isLower, isUpper }) =>
    `${!isUpper ? `${width}px ` : '0 '} ${
      !isLower ? `${width}px ${width}px ` : '0 0 '
    } ${!isUpper ? `${width}px` : '0'}`};
  border: 2px solid ${({ theme }) => theme.color('background', 2)};
  background: ${({ theme }) => theme.color('background')};
  text-align: center;
  cursor: col-resize;
  ${({ theme }) => theme.boxShadow()}
  ${({ isLower }) => isLower && `margin-left: 2px;`}
  ${({ isUpper, width }) => isUpper && `margin-left: ${width - 2}px;`}
`

const NumberFieldsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing()};
  margin-top: ${({ theme }) => theme.spacing()};
`

const NumberInput = styled.input`
  font-family: 'plex-mono';
  background: ${({ theme }) => theme.color('background', 1)};
  padding: ${({ theme }) =>
    `${theme.spacing(0.5)} 0 ${theme.spacing(0.5)} ${theme.spacing(8)}`};
  font-weight: 400;
  color: ${({ theme, isDefault }) =>
    theme.color(isDefault ? 'text' : 'highlight', 1)};
  :focus {
    font-weight: 800;
  }
`

const NumberLabelWrapper = styled.span`
  display: inline-block;
  position: relative;
`

const NumberLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  padding: ${({ theme }) => theme.spacing(0.5)};
`

function getMouseX(event, containerRef) {
  return (
    event.nativeEvent.clientX -
    containerRef.current.getBoundingClientRect().left
  )
}

function getMousePosition(mouseX, width) {
  return mouseX / width
}

function getStepPosition(stepIndex, min, max, steps) {
  if (!stepIndex) return 0
  return stepIndex / steps
}

function getStepIndex(position, steps) {
  const nearestStepIndex = Math.round(steps * position)
  return nearestStepIndex
}

function getLowerStepIndex(value, isRange, steps) {
  if (typeof value === 'number') return value
  return isRange ? 0 : steps
}

function getUpperStepIndex(value, isRange, steps) {
  if (!isRange) return null // Unused unless isRange
  if (typeof value === 'number') return value
  return steps
}

function getValueFromStepIndex(stepIndex, stepInterval, min) {
  return stepIndex * stepInterval + min
}

function getStepIndexFromValue(value, stepInterval, min) {
  if (typeof value !== 'number') return value
  return Math.round((value - min) / stepInterval)
}

function getNearestFieldName(
  mousePosition,
  position,
  upperPosition,
  fieldNames
) {
  const lowerDistance = Math.abs(mousePosition - position)
  const upperDistance = Math.abs(mousePosition - upperPosition)
  const fieldIndex = lowerDistance < upperDistance ? 0 : 1

  return fieldNames[fieldIndex]
}

function getNudgeNumber(e) {
  switch (e.key || e.keyCode) {
    case 'ArrowLeft':
    case 'Left':
    case 37:
      return -1
    case 'ArrowRight':
    case 'Right':
    case 39:
      return 1
  }
}

function Slider({
  min = 0,
  max,
  steps,
  stepInterval = 1,
  onChange,
  fieldNames = ['index'],
  values,
  setFieldValue,
  controlWidth = CONTROL_WIDTH,
  width = WIDTH,
  override = {},
  tooltipProps = {},
}) {
  /**
   *** Props, validation, settings
   **/

  min = calculatableProp(min)
  max = calculatableProp(max)

  if (fieldNames.length > 2) {
    throw new Error(
      `Slider supports up to 2 fields, received ${fieldNames.length}`
    )
  }
  // If isRange, Slider has two control points, showing range between them, for example:
  // isRange === true    |------<====>---| values = { min: 7, max: 12 }
  // isRange === false   |======>--------| values = { index: 7 }
  const isRange = fieldNames.length === 2

  if (!steps) {
    // e.g. if highest value is 4.3 mb, stepInterval every 500kb => 9 steps, max is 4.5 mb
    steps = Math.ceil((max - min) / stepInterval)
    max = steps * stepInterval + min
  }

  /**
   *** Hooks, state, `position` and `stepIndex`
   **/

  const containerRef = useRef()
  const lowerInputRef = useRef()
  const upperInputRef = useRef()
  const lowerControlRef = useRef()
  const upperControlRef = useRef()

  const [fieldIsSliding, setFieldSliding] = useState('')

  // Statefully store temporarily-invalid input while a user types,
  // e.g. if the lower end of a range is "5", the upper end is "12",
  // store the (invalid) "1" when user deletes "2" while typing "14"
  const [lowerNumberInput, setLowerNumberInput] = useState(null)
  const [upperNumberInput, setUpperNumberInput] = useState(null)

  // If a `value` has no defined number, position based on min/max
  // so the default display adapts as min/max change
  const lowerStepIndex = getLowerStepIndex(
    getStepIndexFromValue(values[fieldNames[0]], stepInterval, min),
    isRange,
    steps
  )
  const upperStepIndex = getUpperStepIndex(
    getStepIndexFromValue(values[fieldNames[1]], stepInterval, min),
    isRange,
    steps
  )

  // Position is a decimal number >=0 <=1 representing the % distance along the slider
  const lowerPosition = getStepPosition(lowerStepIndex, min, max, steps)

  const upperPosition = isRange
    ? getStepPosition(upperStepIndex, min, max, steps)
    : null

  const getValidatedValue = (value, fieldName) => {
    const isLower = isRange && fieldName === fieldNames[0]
    const stepIndex = getStepIndexFromValue(value, stepInterval, min)

    if (isLower) {
      if (value <= min) return ['', false] // Follows `min` if it changes
      if (stepIndex >= upperStepIndex)
        return [getValueFromStepIndex(upperStepIndex, stepInterval, min), false] // Don't cross over
      return [value, true]
    }

    if (value >= max) return ['', false] // Follows `max` if it changes
    if (isRange && stepIndex <= lowerStepIndex)
      return [getValueFromStepIndex(lowerStepIndex, stepInterval, min), false] // Don't cross over
    return [value, true]
  }

  /**
   *** User interaction handlers
   **/

  const slideStart = (event, fieldName) => {
    event.stopPropagation()
    setFieldSliding(fieldName)
  }
  const slideEnd = () => {
    setFieldSliding('')
  }
  const handleMouseMove = (event, fieldName = fieldIsSliding) => {
    if (!fieldName) return
    const mouseX = getMouseX(event, containerRef)
    const containerWidth = containerRef.current.getBoundingClientRect().width
    const position = getMousePosition(mouseX, containerWidth)

    const stepIndex = getStepIndex(position, steps)
    const value = getValueFromStepIndex(stepIndex, stepInterval, min)

    handleChange(value, fieldName)
  }
  const handleClick = async event => {
    let fieldName = fieldNames[0]
    if (isRange) {
      const mouseX = getMouseX(event, containerRef)
      const mousePosition = getMousePosition(mouseX, width)
      fieldName = getNearestFieldName(
        mousePosition,
        lowerPosition,
        upperPosition,
        fieldNames
      )
    }
    handleMouseMove(event, fieldName)
    const focusRef =
      fieldName === fieldNames[0] ? lowerControlRef : upperControlRef
    focusRef.current.focus()
  }
  const handleNumberInput = (event, fieldName) => {
    const value = parseInt(event.target.value)

    if (isNaN(value)) {
      updateNumberInput(fieldName, '')
    } else {
      handleChange(value, fieldName)
    }
  }
  const handleChange = (value, fieldName) => {
    const [newValue, wasValid] = getValidatedValue(value, fieldName)

    updateFieldValue(fieldName, newValue)

    // Allow number input field to display invalid numbers while user types
    const displayValue = wasValid ? null : value
    updateNumberInput(fieldName, displayValue)
  }
  const updateFieldValue = async (fieldName, newValue) => {
    const isValidNumber =
      !isNaN(newValue) &&
      newValue !== values[fieldName] &&
      newValue >= min &&
      newValue <= max

    if (isValidNumber || newValue === '') {
      await setFieldValue(fieldName, newValue)
      onChange()
    }
  }
  const updateNumberInput = (fieldName, value) => {
    const isUpper = isRange && fieldName === 'max'
    const setNumberInput = isUpper ? setUpperNumberInput : setLowerNumberInput
    const numberInputRef = isUpper ? upperInputRef : lowerInputRef

    const isInFocus = document.activeElement === numberInputRef.current

    // Only set number input state while input is in focus
    setNumberInput(isInFocus ? value : null)
  }

  const nudgeLower = e =>
    handleChange(
      getValueFromStepIndex(
        lowerStepIndex + getNudgeNumber(e),
        stepInterval,
        min
      ),
      fieldNames[0]
    )
  const nudgeUpper = e =>
    handleChange(
      getValueFromStepIndex(
        upperStepIndex + getNudgeNumber(e),
        stepInterval,
        min
      ),
      fieldNames[1]
    )

  /**
   *** Styling and inline style calculation
   **/

  const belowPercent = `${Math.round(lowerPosition * 100)}%`
  const abovePercent = `${Math.round(
    (1 - (isRange ? upperPosition : lowerPosition)) * 100
  )}%`

  const controlOffset = `calc(${belowPercent} - ${controlWidth}px)`
  const upperControlOffset =
    isRange && `calc(${Math.round(upperPosition * 100)}% - ${controlWidth}px)`

  const FirstSection = isRange ? InactiveSection : ActiveSection

  return (
    <Container
      onMouseUp={slideEnd}
      onMouseLeave={slideEnd}
      onMouseMove={handleMouseMove}
      width={width}
      controlWidth={controlWidth}
      as={override.Container}
    >
      <Bar
        onClick={handleClick}
        controlWidth={controlWidth}
        as={override.Bar}
        ref={containerRef}
      >
        <FirstSection
          style={{ width: belowPercent }}
          as={override.FirstSection}
        />
        <Tooltip {...tooltipProps}>
          <Control
            style={{ left: controlOffset }}
            width={controlWidth}
            onMouseDown={event => slideStart(event, fieldNames[0])}
            isLower={isRange}
            tabIndex={0}
            onKeyDown={nudgeLower}
            ref={lowerControlRef}
            as={override.Control}
          >
            <Field
              type="hidden"
              name={fieldNames[0]}
              value={values[fieldNames[0]]}
            />
          </Control>
        </Tooltip>
        {isRange && (
          <>
            <ActiveSection as={override.ActiveSection} />
            <Tooltip {...tooltipProps}>
              <Control
                style={{ left: upperControlOffset }}
                width={controlWidth}
                onMouseDown={event => slideStart(event, fieldNames[1])}
                isUpper={isRange}
                tabIndex={0}
                onKeyDown={nudgeUpper}
                ref={upperControlRef}
                as={override.Control}
              >
                <Field
                  type="hidden"
                  name={fieldNames[1]}
                  value={values[fieldNames[1]]}
                />
              </Control>
            </Tooltip>
          </>
        )}
        <InactiveSection
          style={{ width: abovePercent }}
          as={override.InactiveSection}
        />
      </Bar>
      <NumberFieldsWrapper as={override.NumberFieldsWrapper}>
        <NumberLabelWrapper as={override.NumberLabelWrapper}>
          {isRange && <NumberLabel as={override.NumberLabel}>Min:</NumberLabel>}
          <NumberInput
            type="number"
            ref={lowerInputRef}
            step={stepInterval}
            isDefault={typeof values[fieldNames[0]] !== 'number'}
            min={min}
            max={max}
            value={
              lowerNumberInput !== null
                ? lowerNumberInput
                : getValueFromStepIndex(lowerStepIndex, stepInterval, min)
            }
            onChange={event => handleNumberInput(event, fieldNames[0])}
            onBlur={() => updateNumberInput(fieldNames[0], null)}
            as={override.NumberInput}
          />
          <Icon
            type="cancel"
            onClick={() => updateFieldValue(fieldNames[0], '')}
            active={typeof values[fieldNames[0]] === 'number'}
            disabled={typeof values[fieldNames[0]] !== 'number'}
          />
        </NumberLabelWrapper>
        {isRange && (
          <NumberLabelWrapper as={override.NumberLabelWrapper}>
            <NumberLabel as={override.NumberLabel}>Max:</NumberLabel>
            <NumberInput
              type="number"
              ref={upperInputRef}
              step={stepInterval}
              isDefault={typeof values[fieldNames[1]] !== 'number'}
              min={min}
              max={max}
              value={
                upperNumberInput !== null
                  ? upperNumberInput
                  : getValueFromStepIndex(upperStepIndex, stepInterval, min)
              }
              onChange={event => handleNumberInput(event, fieldNames[1])}
              onBlur={() => updateNumberInput(fieldNames[1], null)}
              as={override.NumberInput}
            />
            <Icon
              type="cancel"
              onClick={() => updateFieldValue(fieldNames[1], '')}
              active={typeof values[fieldNames[1]] === 'number'}
              disabled={typeof values[fieldNames[1]] !== 'number'}
            />
          </NumberLabelWrapper>
        )}
      </NumberFieldsWrapper>
    </Container>
  )
}

Slider.propTypes = {
  onChange: T.func.isRequired,
  values: T.object.isRequired,
  setFieldValue: T.func.isRequired,
  fieldNames: T.array,
  min: T.oneOfType([T.number, T.func]),
  max: T.oneOfType([T.number, T.func]).isRequired,
  steps: T.number,
  stepInterval: T.number,
  controlWidth: T.number,
  width: T.number,
  override: T.object,
  tooltipProps: T.object,
}

export default Slider
