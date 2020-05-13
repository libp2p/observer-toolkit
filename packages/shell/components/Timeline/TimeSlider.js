import React, { useContext, useRef } from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import {
  formatTime,
  DataContext,
  Formik,
  Icon,
  SetterContext,
  Slider,
  TimeContext,
  Tooltip,
} from '@nearform/observer-sdk'

import { getTime } from '@nearform/observer-data'

const FormWrapper = styled.div`
  height: inherit;
`

const Container = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
`
const FirstSection = styled.div`
  background: none;
  border-radius: none;
  pointer-events: none;
`
const Control = styled.div.attrs(() => ({
  'data-testid': 'timeline-slider',
}))`
  background-color: ${({ theme }) => theme.color('highlight', 0, 0.5)};
  outline: 2px solid ${({ theme }) => theme.color('highlight', 0, 0.3)};
  border: none;
  border-radius: 0;
  height: 100%;
  margin-top: 0;
  top: 0;
  z-index: 3;
  // Position between data points
  margin-left: ${({ width }) => width / 2}px;
  :focus {
    box-shadow: ${({ theme }) => theme.color('background', 0, 0.2)} 0 0 4px 2px;
  }
`
const InactiveSection = styled.div`
  background-color: ${({ theme }) => theme.color('contrast', 0, 0.8)};
  z-index: 2;
  // Cover any x-axis labels that overspill with a hanging border
  border-right: solid transparent ${({ theme }) => theme.spacing(2)};
  margin-right: -${({ theme }) => theme.spacing(2)};
  box-sizing: content-box;
`
const NumberFieldsWrapper = styled.div`
  display: none;
`

const TooltipContent = styled.div`
  font-weight: 600;
  font-size: 8pt;
  font-family: plex-sans, sans-serif;
  color: ${({ theme }) => theme.color('text', 3)};
  border-radius: ${({ theme }) => theme.spacing()};
  padding: ${({ theme }) => theme.spacing([0.5, 1])};
  white-space: nowrap;
`

const TooltipPositioner = styled.div`
  top: ${({ theme }) => theme.spacing(-1)};
  bottom: unset;
`

const TimeLabel = styled.label`
  vertical-align: middle;
`

const ResetTimeIcon = styled.button`
  margin: ${({ theme }) => theme.spacing([-0.5, 0])};
  padding: ${({ theme }) => theme.spacing(0.25)};
  display: inline-block;
  border-radius: 50%;
  :hover,
  :focus {
    background: ${({ theme }) => theme.color('highlight', 1)};
  }
`

const ResetTimeTooltip = styled.div`
  color: ${({ theme }) => theme.color('text', 1)};
`

const ResetTimeTooltipTarget = styled.span`
  margin-right: ${({ theme }) => theme.spacing(-1)};
`

function TimeSlider({ width, override = {}, theme }) {
  const containerRef = useRef()

  const dataset = useContext(DataContext)
  const timepoint = useContext(TimeContext)
  const { setTimepoint } = useContext(SetterContext)

  const timeIndex = dataset.indexOf(timepoint)
  const readableTime = formatTime(getTime(timepoint))

  const controlWidth = width / dataset.length

  const isLatestTimepoint = timeIndex === dataset.length - 1
  const unsetTimepoint = e => {
    e.stopPropagation()
    setTimepoint(null)
  }

  const handleChange = stepIndex => setTimepoint(dataset[stepIndex])

  const sliderOverrides = Object.assign(
    {
      Container,
      FirstSection,
      InactiveSection,
      Control,
      NumberFieldsWrapper,
    },
    override
  )

  const initialValues = { index: timeIndex }

  const tooltipProps = {
    fixOn: 'always',
    colorKey: 'highlight',
    override: {
      Content: TooltipContent,
      Positioner: TooltipPositioner,
    },
    containerRef,
    toleranceX: parseInt(theme.spacing(2)),
    toleranceY: parseInt(theme.spacing(2)),
    content: (
      <>
        <TimeLabel>{readableTime}</TimeLabel>
        {!isLatestTimepoint && (
          <Tooltip
            content={<ResetTimeTooltip>Reset to latest time</ResetTimeTooltip>}
            override={{ Target: ResetTimeTooltipTarget }}
          >
            <Icon
              type="remove"
              aria-label="Close"
              onClick={unsetTimepoint}
              override={{ Container: ResetTimeIcon }}
            />
          </Tooltip>
        )}
      </>
    ),
  }

  return (
    <FormWrapper ref={containerRef}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={values => {
          handleChange(values.index)
        }}
      >
        {({ values, setFieldValue, submitForm }) => (
          <Slider
            onChange={submitForm}
            values={values}
            setFieldValue={setFieldValue}
            max={dataset.length - 1}
            controlWidth={controlWidth}
            override={sliderOverrides}
            width={width}
            tooltipProps={tooltipProps}
          />
        )}
      </Formik>
    </FormWrapper>
  )
}

TimeSlider.propTypes = {
  width: T.number,
  override: T.object,
  theme: T.object.isRequired,
}

export default withTheme(TimeSlider)
