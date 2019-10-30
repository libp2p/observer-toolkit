import React, { useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Field } from 'formik'

const CONTROL_WIDTH = 16
const BAR_HEIGHT = 12
const WIDTH = 340

// TODO
const Tooltip = styled.div`
  display: none;
`

const Container = styled.div`
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(2)} 0`};
  user-select: none;
  width: ${({ width }) => width}px;
`

const Bar = styled.div`
  background: ${({ theme }) => theme.color('light', 'light')};
  border-radius: ${({ theme }) => theme.spacing()};
  border: 2px solid ${({ theme }) => theme.color('light', 'dark')};
  height: ${BAR_HEIGHT}px;
  display: flex;
  position: relative;
  cursor: pointer;
`

const ActiveSection = styled.div`
  flex-grow: 1;
  background: ${({ theme }) => theme.color('primary', 'mid')};
  height: 100%;
  border-radius: ${({ theme }) => theme.spacing()};
  user-select: none;
`
const InactiveSection = styled.div`
  height: 100%;
  user-select: none;
`

const Control = styled.div`
  position: absolute;
  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;
  margin-top: -${BAR_HEIGHT / 2}px;
  border-radius: ${({ width, isLower, isUpper }) =>
    `${!isUpper ? `${width}px ` : '0 '} ${
      !isLower ? `${width}px ${width}px ` : '0 0 '
    } ${!isUpper ? `${width}px` : '0'}`};
  border: 2px solid ${({ theme }) => theme.color('light', 'dark')};
  background: ${({ theme }) => theme.color('light', 'mid')};
  text-align: center;
  box-shadow: 0px 1px 2px ${({ theme }) => theme.color('dark', 'light')};
  cursor: col-resize;
  ${({ isLower }) => isLower && `margin-left: 2px;`}
  ${({ isUpper, width }) => isUpper && `margin-left: ${width - 2}px;`}
`

const NumberFieldsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing()};
  margin-top: ${({ theme }) => theme.spacing()};
`

// This is a user-controlled input that also updates its value every re-render
// so handle it outside Formik as it's neither 100% controlled nor uncontrolled
const NumberInput = styled.input`
  border: 1px solid ${({ theme }) => theme.color('light', 'dark')};
  background: ${({ theme }) => theme.color('light', 'light')};
  padding: ${({ theme }) =>
    `${theme.spacing(0.5)} 0 ${theme.spacing(0.5)} ${theme.spacing(8)}`};
  font-weight: 700;
  color: ${({ theme }) => theme.color('text', 'light')};
  :focus {
    color: ${({ theme }) => theme.color('text', 'dark')};
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

function snapToStep(position, steps) {
  const nearestStep = Math.round(steps * position)
  const snappedPosition = nearestStep ? Math.min(1, nearestStep / steps) : 0
  return {
    snappedPosition,
    nearestStep,
  }
}

function getPosition(stepIndex, steps) {
  return stepIndex / steps
}

function getMouseX(event, containerRef) {
  return (
    event.nativeEvent.clientX -
    containerRef.current.getBoundingClientRect().left
  )
}

function getMousePosition(mouseX, width) {
  return mouseX / width
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

function Slider({
  min,
  max,
  steps,
  stepInterval = 1,
  onChange,
  fieldNames,
  values,
  setFieldValue,
  controlWidth = CONTROL_WIDTH,
  width = WIDTH,
}) {
  if (!steps) {
    // e.g. highest value is 4.3 mb, stepInterval every 500kb => 9 steps, max is 4.5 mb
    steps = Math.ceil(max / stepInterval)
    max = steps * stepInterval
  }

  // If isRange, two control points, showing range between them like:
  // for example:           |------<====>--------| 7 - 12
  // Otherwise, just one:   |===========>--------| 12
  const isRange = fieldNames.length === 2
  if (fieldNames.length > 2)
    throw new Error(
      `Slider supports up to 2 fields, received ${fieldNames.length}`
    )

  const [fieldIsSliding, setFieldSliding] = useState('')

  // Position is a decimal number >=0 <=1 representing the % distance along the slider
  const [lowerPosition, setLowerPosition] = useState(
    getPosition(values[fieldNames[0]], steps)
  )
  const [upperPosition, setUpperPosition] = useState(
    isRange ? getPosition(values[fieldNames[1]], steps) : null
  )
  const setFieldPosition = (position, fieldName) => {
    const setter =
      fieldNames[1] === fieldName ? setUpperPosition : setLowerPosition
    setter(position)
  }

  // Normally number input === field values, but they can temporarily diverge to allow invalid
  // number input values while typing; e.g. if min is 20, max is 75, user presses backspace in max
  // then 9, wanting '79', we should allow the invalid value '7' until user has finished typing
  const [lowerNumberInput, setLowerNumberInput] = useState(
    values[fieldNames[0]]
  )
  const [upperNumberInput, setUpperNumberInput] = useState(
    values[fieldNames[1]]
  )

  const containerRef = useRef()
  const lowerInputRef = useRef()
  const upperInputRef = useRef()

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
    const mousePosition = getMousePosition(mouseX, width)

    const { snappedPosition, nearestStep } = snapToStep(mousePosition, steps)
    handleChange(snappedPosition, nearestStep, fieldName)
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
  }
  const handleNumberInput = (event, fieldName) => {
    const stepIndex = parseInt(event.target.value)
    const position = getPosition(stepIndex, steps)
    const hasChanged = handleChange(position, stepIndex, fieldName)
    if (!hasChanged) updateNumberInput(fieldName, stepIndex)
  }
  const handleChange = (position, stepIndex, fieldName) => {
    // Don't apply invalid values
    if (fieldName === fieldNames[0] && stepIndex < min) return false

    if (isRange) {
      if (
        fieldName === fieldNames[0] &&
        (position > upperPosition || stepIndex > values[fieldNames[1]])
      ) {
        return false
      }

      if (fieldName === fieldNames[1]) {
        if (position < lowerPosition || stepIndex < values[fieldNames[0]]) {
          return false
        }

        if (stepIndex > max) return false
      }
    }

    setFieldPosition(position, fieldName)
    updateFieldValue(fieldName, stepIndex)
    return true
  }
  const updateFieldValue = async (fieldName, stepIndex) => {
    updateNumberInput(fieldName, stepIndex)
    if (stepIndex !== values[fieldName]) {
      await setFieldValue(fieldName, stepIndex)
      onChange()
    }
  }
  const updateNumberInput = (fieldName, stepIndex) => {
    const setNumberInput =
      isRange && fieldName === 'max' ? setUpperNumberInput : setLowerNumberInput
    setNumberInput(stepIndex)
  }

  const belowPercent = `${Math.round(lowerPosition * 100)}%`
  const abovePercent = `${Math.round(
    (1 - (isRange ? upperPosition : lowerPosition)) * 100
  )}%`

  const controlOffset = `calc(${belowPercent} - ${controlWidth}px)`
  const upperControlOffset =
    isRange && `calc(${Math.round(upperPosition * 100)}% - ${controlWidth}px)`

  // Style first range bar as highlighted or unhighlighted depending on isRange
  const FirstSection = isRange ? InactiveSection : ActiveSection

  return (
    <Container
      onMouseUp={slideEnd}
      onMouseLeave={slideEnd}
      onMouseMove={handleMouseMove}
      ref={containerRef}
      width={width}
    >
      <Bar onClick={handleClick}>
        <FirstSection style={{ width: belowPercent }} />
        <Control
          style={{ left: controlOffset }}
          width={controlWidth}
          onMouseDown={event => slideStart(event, fieldNames[0])}
          isLower={isRange}
        >
          <Field
            type="hidden"
            name={fieldNames[0]}
            value={values[fieldNames[0]]}
          />
        </Control>
        {isRange && (
          <>
            <ActiveSection />
            <Control
              style={{ left: upperControlOffset }}
              width={controlWidth}
              onMouseDown={event => slideStart(event, fieldNames[1])}
              isUpper={isRange}
            >
              <Tooltip></Tooltip>
            </Control>
          </>
        )}
        <InactiveSection style={{ width: abovePercent }} />
      </Bar>
      <NumberFieldsWrapper>
        <NumberLabelWrapper>
          {isRange && <NumberLabel>Min:</NumberLabel>}
          <NumberInput
            type="number"
            ref={lowerInputRef}
            step={stepInterval}
            min={min}
            max={max}
            value={lowerNumberInput}
            onChange={event => handleNumberInput(event, fieldNames[0])}
            onBlur={() =>
              updateNumberInput(fieldNames[0], values[fieldNames[0]])
            }
          />
        </NumberLabelWrapper>
        {isRange && (
          <NumberLabelWrapper>
            <NumberLabel>Max:</NumberLabel>
            <NumberInput
              type="number"
              ref={upperInputRef}
              step={stepInterval}
              min={min}
              max={max}
              value={upperNumberInput}
              onChange={event => handleNumberInput(event, fieldNames[1])}
              onBlur={() =>
                updateNumberInput(fieldNames[1], values[fieldNames[1]])
              }
            />
          </NumberLabelWrapper>
        )}
      </NumberFieldsWrapper>
    </Container>
  )
}

Slider.propTypes = {
  fieldNames: T.array.isRequired,
  onChange: T.func.isRequired,
  values: T.object.isRequired,
  setFieldValue: T.func.isRequired,
  min: T.number,
  max: T.number,
  steps: T.number,
  stepInterval: T.number,
  controlWidth: T.number,
  width: T.number,
}

export default Slider
