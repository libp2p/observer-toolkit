import React, { useContext, useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { uploadWebSocket } from '../../utils'
import { SetterContext } from '../context/DataProvider'

import StyledButton from './StyledButton'

const WebSocketButton = styled(StyledButton)`
  position: relative;
  z-index: 5;
`
const NativeSocketInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`
const RelativeSpan = styled.span`
  position: relative;
`

function getButtonText(isLoading, socketUrl, title) {
  if (isLoading) return 'Loading...'
  return socketUrl ? `Replace websocket url '${socketUrl}'` : title
}

function WebSocketDataButton({ title }) {
  const [isLoading, setIsLoading] = useState(false)
  const [socketUrl, setSocketUrl] = useState('')
  const { dispatchDataset } = useContext(SetterContext)
  const urlInputRef = useRef()

  function handleClick() {
    urlInputRef.current.click()
  }

  function handleUpload(event) {
    const url = 'http://localhost:8080' // event.target.files[0]
    uploadWebSocket(
      url,
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

  function handleUploadFinish(file) {
    setIsLoading(false)
    setSocketUrl(file.name)
  }

  const buttonText = getButtonText(isLoading, socketUrl, title)

  return (
    <RelativeSpan>
      <WebSocketButton onClick={handleClick}>{buttonText}</WebSocketButton>
      <NativeSocketInput
        ref={urlInputRef}
        type="file"
        name="websocket"
        onChange={handleUpload}
      />
    </RelativeSpan>
  )
}

WebSocketDataButton.propTypes = {
  title: T.string.isRequired,
}

export default WebSocketDataButton
