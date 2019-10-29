import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Formik, Field } from 'formik'

import Icon from '../Icon'

function areAllChecked(values) {
  return Object.values(values).every(value => value)
}

function toggleAll(values, fieldNames, setFieldValue, submitForm) {
  // tick everything, unless everything is already ticked, then tick nothing
  const newValue = !areAllChecked(values)
  Promise.all(fieldNames.map(name => setFieldValue(name, newValue))).then(
    submitForm
  )
}

function toggleField(values, name, setFieldValue, submitForm) {
  setFieldValue(name, !values[name], false)
  submitForm()
}

function getDefaultValues(fieldNames, defaultValue) {
  return fieldNames.reduce((values, name) => {
    values[name] = defaultValue
    return values
  }, {})
}

const Container = styled.div`
  display: flex;
`

const StyledHeader = styled.div`
  border: 1px solid ${({ theme }) => theme.color('tertiary', 'mid')};
  font-weight: 900;
`

const StyledList = styled.ul`
  margin: 0;
  padding: 0;
  text-align: left;
  display: flex;
`

const StyledListItem = styled.li`
  margin: 0 ${({ theme }) => theme.spacing(0.5)};
  padding: 0;
  list-style: none;
`

const StyledToggleButton = styled.button`
  cursor: pointer;
  border: none;
  background: ${({ theme }) => theme.color('light', 'light')};
  width: 100%;
  text-align: left;
  font-weight: ${({ checked }) => (checked ? 600 : 300)};
  color: ${({ theme, checked }) =>
    theme.color(checked ? 'tertiary' : 'text', 'mid')};
  :focus,
  :hover {
    outline: none;
    background: ${({ theme }) => theme.color('light', 'dark')};
  }
`

function CheckboxList({
  fieldNames,
  initialValues,
  title,
  defaultValue,
  onChange,
}) {
  if (defaultValue !== undefined) {
    const defaultValues = getDefaultValues(fieldNames, defaultValue)
    initialValues = Object.assign({}, defaultValues, initialValues)
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { setSubmitting }) => {
        onChange(values)
        setSubmitting(false)
      }}
    >
      {({ values, handleChange, setFieldValue, isSubmitting, submitForm }) => (
        <Container>
          <StyledHeader>
            <StyledToggleButton
              onClick={() =>
                toggleAll(values, fieldNames, setFieldValue, submitForm)
              }
            >
              <Field
                type="hidden"
                name="set-all"
                value={areAllChecked(values)}
              />
              <Icon type={areAllChecked(values) ? 'check' : 'uncheck'} />
              {title}
            </StyledToggleButton>
          </StyledHeader>
          <StyledList>
            {fieldNames.map(name => (
              <StyledListItem key={name}>
                <StyledToggleButton
                  onClick={() =>
                    toggleField(values, name, setFieldValue, submitForm)
                  }
                  checked={values[name]}
                >
                  <Field type="hidden" name={name} value={values[name]} />
                  <Icon type={values[name] ? 'check' : 'uncheck'} />
                  {name}
                </StyledToggleButton>
              </StyledListItem>
            ))}
          </StyledList>
        </Container>
      )}
    </Formik>
  )
}

CheckboxList.propTypes = {
  fieldNames: T.arrayOf(T.string).isRequired,
  title: T.string.isRequired,
  initialValues: T.object,
  defaultValue: T.bool,
  onChange: T.func.isRequired,
}

export default CheckboxList
