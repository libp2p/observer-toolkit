import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Field } from 'formik'

import Icon from '../../Icon'

function areAllChecked(values) {
  return Object.values(values).every(value => value)
}

function areAnyChecked(values) {
  return Object.values(values).some(value => value)
}

async function toggleAll(values, fieldNames, setFieldValue, onChange) {
  // tick everything, unless everything is already ticked, then tick nothing
  const newValue = !areAllChecked(values)
  await Promise.all(fieldNames.map(name => setFieldValue(name, newValue)))
  onChange()
}

async function toggleField(values, name, setFieldValue, onChange) {
  await setFieldValue(name, !values[name])
  onChange()
}

const Container = styled.div`
  display: flex;
  flex-direction: ${({ orientation }) => orientation};
`

const StyledHeader = styled.div`
  border: 1px solid ${({ theme }) => theme.color('background', 2)};
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
  white-space: nowrap;
  cursor: pointer;
  border: none;
  background: ${({ theme }) => theme.color('background', 0)};
  width: 100%;
  text-align: left;
  font-weight: ${({ checked }) => (checked ? 600 : 300)};
  color: ${({ theme, checked }) =>
    theme.color('text', checked ? 0 : 2)};
  :focus {
    outline: none;
  }
  :hover {
    background: ${({ theme }) => theme.color('background', 2, 0.5)};
  }
`

function CheckboxList({
  title,
  fieldNames,
  setFieldValue,
  orientation = 'row',
  onChange,
  values,
  override = {},
}) {
  const allAreChecked = areAllChecked(values)
  const anyAreChecked = allAreChecked || areAnyChecked(values)

  const checkAllChecked =
    (allAreChecked && 'true') || (anyAreChecked ? 'mixed' : 'false')

  const iconsMapping = {
    true: 'check',
    mixed: 'mixed',
    false: 'uncheck',
  }

  return (
    <Container orientation={orientation} as={override.Container}>
      <StyledHeader as={override.StyledHeader}>
        <StyledToggleButton
          onClick={() => toggleAll(values, fieldNames, setFieldValue, onChange)}
          role="checkbox"
          aria-checked={checkAllChecked}
          as={override.StyledToggleButton}
        >
          <Field type="hidden" name="set-all" value={allAreChecked} />
          <Icon type={iconsMapping[checkAllChecked]} />
          <label>{`${allAreChecked ? 'Uncheck' : 'Check'} all`}</label>
        </StyledToggleButton>
      </StyledHeader>
      <StyledList as={override.StyledList}>
        {fieldNames.map(name => (
          <StyledListItem key={name} as={override.StyledListItem}>
            <StyledToggleButton
              onClick={() => toggleField(values, name, setFieldValue, onChange)}
              role="checkbox"
              checked={values[name]}
              aria-checked={!!values[name]}
              as={override.StyledToggleButton}
            >
              <Field type="hidden" name={name} value={values[name]} />
              <Icon type={iconsMapping[`${!!values[name]}`]} />
              <label>{name}</label>
            </StyledToggleButton>
          </StyledListItem>
        ))}
      </StyledList>
    </Container>
  )
}

CheckboxList.propTypes = {
  fieldNames: T.arrayOf(T.string).isRequired,
  title: T.string.isRequired,
  setFieldValue: T.func.isRequired,
  onChange: T.func.isRequired,
  values: T.object.isRequired,
  orientation: T.oneOf(['row', 'column']),
  override: T.object,
}

export default CheckboxList
