import React, { useEffect, useRef } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Field } from 'formik'
import debounce from 'lodash.debounce'

import Icon from '../../Icon'

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing()};
`

function validateRegexp(values) {
  if (values.regexp) {
    try {
      new RegExp(values.string)
      return
    } catch (err) {
      return err
    }
  }
  return
}

const TextInputSection = styled.div``

const TextInput = styled(Field)`
  padding: ${({ theme }) => theme.spacing()};
  margin: ${({ theme }) => theme.spacing([1, 0])};
  text-align: left;
  font-family: 'plex-mono';
  font-weight: 400;
  background: ${({ theme }) => theme.color('background', 1)};
  border: none;
  min-width: ${({ theme }) => theme.spacing(30)};
  :focus {
    font-weight: 800;
  }
`

const ErrorMessage = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.color('highlight')};
`

const OptionsSection = styled.div`
  padding: ${({ theme }) => theme.spacing()};
`

const Label = styled.label``

const StyledToggleButton = styled.button`
  white-space: nowrap;
  cursor: pointer;
  border: none;
  background: ${({ theme }) => theme.color('background', 0)};
  width: 100%;
  text-align: left;
  font-weight: ${({ checked }) => (checked ? 600 : 300)};
  color: ${({ theme, checked }) => theme.color('text', checked ? 0 : 2)};
  :focus {
    outline: none;
  }
  :hover {
    background: ${({ theme }) => theme.color('background', 2, 0.5)};
  }
`

function StringMatch({
  title,
  setFieldValue,
  onChange,
  values,
  override = {},
}) {
  const errorRef = useRef()
  const doChange = debounce(onChange, 300)

  const toggleRegexp = async () => {
    await setFieldValue('regexp', !values.regexp)
    doChange()
  }
  const toggleExclude = async () => {
    await setFieldValue('exclude', !values.exclude)
    doChange()
  }
  const handleTextChange = async event => {
    const str = event.target.value
    await setFieldValue('string', str)
    doChange()
  }

  useEffect(() => {
    const err = validateRegexp(values)
    if (err) {
      errorRef.current.textContent = err.toString()
    } else {
      errorRef.current.textContent = ''
    }
  }, [values, errorRef])

  return (
    <Container>
      <TextInputSection>
        <Label>Enter text to match:</Label>
        <TextInput
          type="text"
          name="string"
          value={values.string}
          onChange={handleTextChange}
          spellCheck={false}
        />
      </TextInputSection>
      <OptionsSection>
        <StyledToggleButton
          onClick={() => toggleRegexp()}
          role="checkbox"
          checked={values.regexp}
          aria-checked={values.regexp}
        >
          <Field type="hidden" name={'regexp'} value={values.regexp} />
          <Icon type={values.regexp ? 'check' : 'uncheck'} />
          <label>Regular expression</label>
        </StyledToggleButton>
        <StyledToggleButton
          onClick={() => toggleExclude()}
          role="checkbox"
          checked={values.exclude}
          aria-checked={values.exclude}
        >
          <Field type="hidden" name={'exclude'} value={values.exclude} />
          <Icon type={values.exclude ? 'check' : 'uncheck'} />
          <label>Exclude matches</label>
        </StyledToggleButton>
      </OptionsSection>
      <ErrorMessage ref={errorRef} />
    </Container>
  )
}

StringMatch.propTypes = {
  title: T.string.isRequired,
  setFieldValue: T.func.isRequired,
  onChange: T.func.isRequired,
  values: T.object.isRequired,
  override: T.object,
}

export default StringMatch
