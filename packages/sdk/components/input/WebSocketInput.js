import React, { useContext, useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { uploadWebSocket } from '../../utils'
import { SetterContext } from '../context/DataProvider'

const defaultUrl = 'ws://localhost:8080'

const InputField = styled.input`
  position: relative;
  z-index: 5;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.color('highlight')};
  color: currentColor;
  padding: ${({ theme }) => theme.spacing()};
  width: 100%;
  :focus {
    box-shadow: ${({ theme }) => theme.color('secondary')} 0 4px 2px;
    outline: none;
  }
`

const Container = styled.span`
  position: relative;
`

function WebSocketInput({ title }) {
  const inputRef = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchDataset } = useContext(SetterContext)

  function handleKeyPress(e) {
    if (e.key === 'Enter' || e.keyCode === 13) handleSubmit()
  }

  function handleSubmit(event) {
    uploadWebSocket(
      inputRef.current.value,
      handleUploadStart,
      handleUploadFinish,
      handleUploadChunk
    )
  }

  function handleUploadStart() {
    setIsLoading(true)
  }

  function handleUploadChunk(data) {
    dispatchDataset({
      action: 'append',
      data,
    })
  }

  function handleUploadFinish(url) {
    setIsLoading(false)
  }

  return (
    <Container>
      {isLoading ? (
        'Loading...'
      ) : (
        <InputField
          autoFocus
          ref={inputRef}
          defaultValue={defaultUrl}
          onKeyPress={handleKeyPress}
        />
      )}
    </Container>
  )
}

WebSocketInput.propTypes = {
  title: T.string.isRequired,
}

export default WebSocketInput
