import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Formik } from 'formik'

import Icon from '../Icon'

const Container = styled.span`
  display: inline-block;
  position: relative;
`

const AccordionContent = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  right: -${({ theme }) => theme.spacing()};
  padding: ${({ theme }) => theme.spacing()};
  background: ${({ theme }) => theme.color('light', 'mid', 0.8)};
  z-index: 20;
`

function FilterButton({
  updateValues,
  FilterUi,
  initialFieldValues,
  mapValues,
  filterUiProps,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  const handleChange = newValues => {
    updateValues(mapValues ? mapValues(newValues) : newValues)
  }

  const fieldNames = [...initialFieldValues.keys()]
  const initialValues = Object.fromEntries(initialFieldValues)

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { setSubmitting }) => {
        handleChange(values)
        setSubmitting(false)
      }}
    >
      {({ values, setFieldValue, isSubmitting, submitForm, dirty }) => (
        <Container>
          <Icon type="filter" onClick={toggleOpen} active={dirty} offset />
          <AccordionContent isOpen={isOpen}>
            <FilterUi
              onChange={submitForm}
              values={values}
              setFieldValue={setFieldValue}
              fieldNames={fieldNames}
              {...filterUiProps}
            />
          </AccordionContent>
        </Container>
      )}
    </Formik>
  )
}

FilterButton.propTypes = {
  updateValues: T.func.isRequired,
  FilterUi: T.elementType.isRequired,
  initialFieldValues: T.instanceOf(Map),
  mapValues: T.func,
  filterUiProps: T.object,
}

export default FilterButton
