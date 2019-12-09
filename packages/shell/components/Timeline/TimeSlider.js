import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Formik } from 'formik'

import {
  formatTime,
  DataContext,
  SetterContext,
  Slider,
  TimeContext,
} from '@libp2p-observer/sdk'

import { getTime } from '@libp2p-observer/data'

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
const Control = styled.div`
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
`
const InactiveSection = styled.div`
  background-color: ${({ theme }) => theme.color('contrast', 0, 0.8)};
  z-index: 2;
`
const NumberFieldsWrapper = styled.div`
  display: none;
`

const TooltipContent = styled.div`
  font-weight: 600;
  font-size: 8pt;
  font-family: 'plex-sans';
  color: ${({ theme }) => theme.color('text', 3)};
  padding: ${({ theme }) => theme.spacing(0.5)}
    ${({ theme }) => theme.spacing(1)};
  border-radius: ${({ theme }) => theme.spacing()};
`

const TooltipPositioner = styled.div`
  top: ${({ theme }) => theme.spacing(-1)};
  bottom: unset;
`

function TimeSlider({ width, override = {} }) {
  const dataset = useContext(DataContext)
  const timepoint = useContext(TimeContext)
  const { setTimepoint } = useContext(SetterContext)

  const timeIndex = dataset.indexOf(timepoint)
  const controlWidth = width / dataset.length

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
    content: formatTime(getTime(timepoint)),
  }

  return (
    <Formik
      initialValues={initialValues}
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
  )
}

TimeSlider.propTypes = {
  width: T.number,
  override: T.object,
}

export default TimeSlider
