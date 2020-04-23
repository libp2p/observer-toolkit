import React, { useContext, useRef } from 'react'
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

function WebSocketInput({
  handleUploadStart,
  handleUploadFinished,
  handleUploadChunk,
  iconRef,
}) {
  const { setWebsocket } = useContext(SetterContext)

  const inputRef = useRef()

  function handleKeyPress(e) {
    if (e.key === 'Enter' || e.keyCode === 13) handleSubmit()
  }

  function handleSubmit() {
    uploadWebSocket(
      inputRef.current.value,
      handleUploadStart,
      handleUploadFinished,
      handleUploadChunk,
      setWebsocket
    )
  }

  useHandlerOnRef({
    targetRef: iconRef,
    handler: handleSubmit,
  })

  return (
    <Container>
      <InputField
        autoFocus
        ref={inputRef}
        defaultValue={defaultUrl}
        onKeyPress={handleKeyPress}
      />
      }
    </Container>
  )
}

WebSocketInput.propTypes = {
  handleUploadStart: T.func.isRequired,
  handleUploadFinished: T.func.isRequired,
  handleUploadChunk: T.func.isRequired,
  iconRef: T.object,
}

export default WebSocketInput
