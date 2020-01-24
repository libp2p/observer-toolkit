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

  function handleClick() {
    handleUpload()
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

  function handleUploadFinish(url) {
    setIsLoading(false)
    setSocketUrl(url)
  }

  const buttonText = getButtonText(isLoading, socketUrl, title)

  return (
    <RelativeSpan>
      <WebSocketButton onClick={handleClick}>{buttonText}</WebSocketButton>
    </RelativeSpan>
  )
}

WebSocketDataButton.propTypes = {
  title: T.string.isRequired,
}

export default WebSocketDataButton
