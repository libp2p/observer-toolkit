import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Formik } from 'formik'
import isEqual from 'lodash.isequal'

import Icon from '../Icon'
import Tooltip from '../Tooltip'
import { RootNodeContext } from '../context/RootNodeProvider'

const Container = styled.span`
  display: inline-block;
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
  const rootNodeRef = useContext(RootNodeContext)
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
          <Tooltip
            side={'bottom'}
            containerRef={rootNodeRef}
            fixOn={'no-hover'}
            content={
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
            }
          >
            <Icon type="filter" active={dirty} offset />
          </Tooltip>
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
