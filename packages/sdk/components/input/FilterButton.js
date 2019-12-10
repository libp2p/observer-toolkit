import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Formik } from 'formik'
import isEqual from 'lodash.isequal'

import Icon from '../Icon'

const Container = styled.span`
  display: inline-block;
`

const AccordionContent = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: ${({ theme }) => theme.spacing(4)};
  left: 0;
  padding: ${({ theme }) => theme.spacing()};
  background: ${({ theme }) => theme.color('background', 1, 0.8)};
  z-index: 20;
`

function FilterButton({
  addFilter,
  removeFilter,
  FilterUi,
  initialFieldValues,
  mapValues,
  filterUiProps,
  name,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  const initialValues = Object.fromEntries(initialFieldValues)

  const handleChange = newValues => {
    if (isEqual(initialValues, newValues)) {
      removeFilter()
    } else {
      addFilter(newValues)
    }
  }

  const fieldNames = [...initialFieldValues.keys()]

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        handleChange(values)
        setSubmitting(false)
      }}
      enableReinitialize
    >
      {({ values, setFieldValue, submitForm, dirty }) => (
        <Container>
          <Icon type="filter" onClick={toggleOpen} active={dirty} offset />
          <AccordionContent isOpen={isOpen}>
            <FilterUi
              // 'Hard' enableReinitialize: remount when initialValues changes
              // key={JSON.stringify(initialValues)}
              onChange={submitForm}
              values={values}
              setFieldValue={setFieldValue}
              fieldNames={fieldNames}
              title={name}
              {...filterUiProps}
            />
          </AccordionContent>
        </Container>
      )}
    </Formik>
  )
}

FilterButton.propTypes = {
  addFilter: T.func.isRequired,
  removeFilter: T.func.isRequired,
  FilterUi: T.elementType.isRequired,
  initialFieldValues: T.instanceOf(Map),
  mapValues: T.func,
  filterUiProps: T.object,
  name: T.string,
}

export default FilterButton
