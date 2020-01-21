import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Formik } from 'formik'
import isEqual from 'lodash.isequal'

import { FilterSetterContext } from '../context/FilterProvider'
import Icon from '../Icon'
import Chip from '../Chip'
import Tooltip from '../Tooltip'
import { RootNodeContext } from '../context/RootNodeProvider'

const Container = styled.span`
  display: inline-block;
  margin: ${({ theme }) => theme.spacing()};
`

const RemoveIconButton = styled.a`
  &:hover {
    background: ${({ theme }) => theme.color('background', 0, 0.5)};
  }
`

const CheckIconButton = styled.a`
  border-radius: 50%;
  background: ${({ theme }) => theme.color('background', 0)};
  &:hover {
    background: ${({ theme }) => theme.color('background', 0, 0.5)};
  }
`

const Positioner = styled.div`
  left: ${({ theme }) => theme.spacing(-4)};
  transform: none;
`

const Tick = styled.div`
  left: ${({ theme }) => theme.spacing(6)};
  transform: none;
`

function FilterChip({
  filter: { name, enabled, values: filterValues, getFilterDef },
}) {
  const {
    FilterUi,
    initialValues,
    filterUiProps,
    valueNames = Object.keys(initialValues),
  } = getFilterDef()

  const rootNodeRef = useContext(RootNodeContext)
  const dispatchFilters = useContext(FilterSetterContext)

  const dispatch = (actionName, values) =>
    dispatchFilters({
      action: actionName,
      name,
      values,
    })

  const handleChange = values => dispatch('update', values)
  const disable = e => {
    e.stopPropagation()
    dispatch('disable')
  }
  const enable = e => {
    e.stopPropagation()
    dispatch('enable')
  }

  const chipOptions = {
    active: {
      colorKey: 'highlight',
    },
    inactive: {
      colorKey: 'text',
      colorIndex: 2,
    },
  }

  return (
    <Formik
      initialValues={filterValues || initialValues}
      onSubmit={(values, { setSubmitting }) => {
        handleChange(values)
        setSubmitting(false)
      }}
      enableReinitialize
    >
      {({ values, resetForm, setFieldValue, submitForm }) => {
        const reset = e => {
          e.stopPropagation()
          resetForm(initialValues)
          submitForm()
        }
        const chipType = enabled ? 'active' : 'inactive'
        const hasValues = !isEqual(values, initialValues)

        const chipPrefix = hasValues ? (
          <Tooltip
            side="top"
            fixOn="never"
            content={`${enabled ? 'Disable' : 'Re-enable'} filter`}
          >
            <Icon
              active={enabled}
              onClick={enabled ? disable : enable}
              type={enabled ? 'check' : 'uncheck'}
              override={{ Container: CheckIconButton }}
            />
          </Tooltip>
        ) : (
          ''
        )

        const chipSuffix = hasValues ? (
          <Tooltip side="top" fixOn="never" content="Reset filter">
            <Icon
              onClick={reset}
              type="remove"
              override={{ Container: RemoveIconButton }}
            />
          </Tooltip>
        ) : (
          ''
        )

        return (
          <Container>
            <Tooltip
              side={'bottom'}
              containerRef={rootNodeRef}
              fixOn={'no-hover'}
              toleranceY={null}
              override={{ Positioner, Tick }}
              content={
                <FilterUi
                  onChange={submitForm}
                  values={values}
                  setFieldValue={setFieldValue}
                  fieldNames={valueNames}
                  title={name}
                  {...filterUiProps}
                />
              }
            >
              <Chip
                type={chipType}
                options={chipOptions}
                prefix={chipPrefix}
                suffix={chipSuffix}
              >
                {name}
              </Chip>
            </Tooltip>
          </Container>
        )
      }}
    </Formik>
  )
}

FilterChip.propTypes = {
  filter: T.shape({
    name: T.string.isRequired,
    values: T.object,
    enabled: T.bool,
    getFilterDef: T.func.isRequired,
  }).isRequired,
  children: T.node,
}

export default FilterChip