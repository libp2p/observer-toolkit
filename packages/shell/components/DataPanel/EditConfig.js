import React, { useEffect, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon, TimeInput } from '@nearform/observer-sdk'
import { Formik } from 'formik'

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: stretch;
`

const EditContainer = styled.div`
  position: absolute;
  padding: ${({ theme }) => theme.spacing()};
  margin-right: ${({ theme }) => theme.spacing(-4)};
  border: 1px solid ${({ theme }) => theme.color('highlight')};
  border-radius: ${({ theme }) => theme.spacing(0.5)};
  white-space: nowrap;
  background: ${({ theme }) => theme.color('background')};
`

const ClickTarget = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
`

function EditConfig({ configValue, handleSend, children }) {
  const [previousConfigValue, setPreviousConfigValue] = useState(configValue)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleFormSubmit = value => {
    setIsLoading(true)
    handleSend(value)
  }

  useEffect(() => {
    if (configValue !== previousConfigValue) {
      setIsLoading(false)
      setPreviousConfigValue(configValue)
    }
  }, [configValue, previousConfigValue])

  return (
    <Container>
      <ClickTarget onClick={() => setIsOpen(true)}>
        {children}
        <Icon type="edit" />
      </ClickTarget>
      {isOpen && (
        <EditContainer>
          <Formik
            initialValues={{ value: configValue }}
            onSubmit={({ value }) => handleFormSubmit(value)}
            enableReinitialize
          >
            {({
              values: { value } = {},
              initialValues,
              setFieldValue,
              submitForm,
              dirty,
              isSubmitting,
            }) => {
              if (isLoading) return 'Awaiting response...'
              const initialValue = initialValues && initialValues.value
              const updateValue = value => setFieldValue('value', value)
              const isActive = !isSubmitting && dirty
              return (
                <>
                  <TimeInput
                    updateValue={updateValue}
                    value={value}
                    defaultValue={initialValue}
                    includeHours={false}
                    includeMs={true}
                    textLabels={true}
                  />
                  <Icon
                    active={isActive}
                    onClick={isActive ? submitForm : null}
                    type={isActive ? 'check' : 'closed'}
                  />
                </>
              )
            }}
          </Formik>
          <Icon type="remove" onClick={() => setIsOpen(false)} />
        </EditContainer>
      )}
    </Container>
  )
}
EditConfig.propTypes = {
  configValue: T.number.isRequired,
  handleSend: T.func.isRequired,
  children: T.node.isRequired,
}

export default EditConfig
