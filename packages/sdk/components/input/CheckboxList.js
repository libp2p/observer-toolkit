import React from 'react'
import { Formik, Field } from 'formik'
import T from 'prop-types'

function areAllChecked(values) {
  return Object.values(values).every(value => value)
}

function toggleAll(values, fieldNames, setFieldValue, submitForm) {
  // tick everything, unless everything is already ticked, then tick nothing
  const newValue = !areAllChecked(values)
  fieldNames.forEach(name => setFieldValue(name, newValue, false))
  submitForm()
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
        <div>
          <h5>
            <button
              onClick={() =>
                toggleAll(values, fieldNames, setFieldValue, submitForm)
              }
            >
              <Field
                type="checkbox"
                name="set-all"
                value={areAllChecked(values)}
              />
              {title}
            </button>
          </h5>
          <ul>
            {fieldNames.map(name => (
              <li key={name}>
                <button
                  onClick={() =>
                    toggleField(values, name, setFieldValue, submitForm)
                  }
                >
                  <Field type="checkbox" name={name} value={values[name]} />
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Formik>
  )
}

CheckboxList.propTypes = {
  fieldNames: T.arrayOf([T.string]).isRequired,
  title: T.string.isRequired,
  initialValues: T.object,
  defaultValue: T.bool,
  onChange: T.func.isRequired,
}

export default CheckboxList
