import React, { useContext, useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { uploadWebSocket } from '../../utils'
import { SetterContext } from '../context/DataProvider'

import StyledButton from './StyledButton'

const FileButton = styled(StyledButton)`
  position: relative;
  z-index: 5;
`
const NativeFileInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`
const RelativeSpan = styled.span`
  position: relative;
`

function getButtonText(isLoading, fileName, title) {
  if (isLoading) return 'Loading...'
  return fileName ? `Replace file '${fileName}'` : title
}

function WebSocketDataButton({ title }) {
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const { dispatchDataset } = useContext(SetterContext)
  const fileInputRef = useRef()

  function handleClick() {
    fileInputRef.current.click()
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
    setFileName(file.name)
  }

  const buttonText = getButtonText(isLoading, fileName, title)

  return (
    <RelativeSpan>
      <FileButton onClick={handleClick}>{buttonText}</FileButton>
      <NativeFileInput
        ref={fileInputRef}
        type="file"
        name="file"
        onChange={handleUpload}
      />
    </RelativeSpan>
  )
}

WebSocketDataButton.propTypes = {
  title: T.string.isRequired,
}

export default WebSocketDataButton
