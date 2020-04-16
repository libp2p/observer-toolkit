import React, { useContext, useRef, useState } from 'react'
import styled from 'styled-components'
import T from 'prop-types'

import {
  uploadWebSocket,
  useHandlerOnRef,
  SetterContext,
} from '@libp2p-observer/sdk'

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

function WebSocketInput({ iconRef }) {
  const inputRef = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const { removeData, updateData, updateSource } = useContext(SetterContext)

  function handleKeyPress(e) {
    if (e.key === 'Enter' || e.keyCode === 13) handleSubmit()
  }

  function handleSubmit() {
    uploadWebSocket(
      inputRef.current.value,
      handleUploadStart,
      handleUploadFinish,
      handleUploadChunk
    )
  }

  function handleUploadStart(url) {
    removeData()
    updateSource({ type: 'live', name: url })
    setIsLoading(true)
  }

  function handleUploadFinish() {
    setIsLoading(false)
  }

  function handleUploadChunk(data) {
    updateData(data)
  }

  useHandlerOnRef({
    targetRef: iconRef,
    handler: handleSubmit,
  })

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
  iconRef: T.object,
}

export default WebSocketInput
