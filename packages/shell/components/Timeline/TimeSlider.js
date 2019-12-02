import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Formik } from 'formik'

import {
  DataContext,
  SetterContext,
  Slider,
  TimeContext,
} from '@libp2p-observer/sdk'

const Container = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  height: 100%;
`
const Bar = styled.div`
  position: relative;
  background: none;
  border: none;
  border-radius: 0;
  height: 100%;
  width: 100%;
  // Push 0 index (left 0) control to the right, while being clickable
  border-left: solid transparent
    ${({ controlWidth }) => Math.round(controlWidth)}px;
`
const FirstSection = styled.div`
  background: none;
  border-radius: none;
`
const Control = styled.div`
  background-color: ${({ theme }) => theme.color('highlight', 0, 0.5)};
  border-left: 2px solid ${({ theme }) => theme.color('highlight', 1, 0.3)};
  border-right: 2px solid ${({ theme }) => theme.color('highlight', 1, 0.3)};
  border-top: none;
  border-bottom: none;
  border-radius: 0;
  height: 100%;
  margin-top: 0;
`
const InactiveSection = styled.div`
  background-color: ${({ theme }) => theme.color('contrast', 0, 0.8)};
`
const NumberFieldsWrapper = styled.div`
  display: none;
`

function TimeSlider({ width }) {
  const dataset = useContext(DataContext)
  const timepoint = useContext(TimeContext)
  const { setTimepoint } = useContext(SetterContext)

  const timeIndex = dataset.indexOf(timepoint)

  const widthPerTime = width / dataset.length
  const handleChange = stepIndex => setTimepoint(dataset[stepIndex])

  const sliderOverrides = {
    Container,
    Bar,
    FirstSection,
    InactiveSection,
    Control,
    NumberFieldsWrapper,
  }

  const initialValues = { index: timeIndex }

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
          controlWidth={widthPerTime}
          override={sliderOverrides}
          width={width}
        />
      )}
    </Formik>
  )
}

TimeSlider.propTypes = {
  width: T.number,
}

export default TimeSlider
