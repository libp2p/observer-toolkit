import React, { useContext, useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { uploadDataFile } from '../../utils'
import { SetterContext } from '../context/DataProvider'

const FileButton = styled.button`
  cursor: pointer;
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
const Container = styled.span`
  position: relative;
`

function getButtonText(isLoading, fileName, title) {
  if (isLoading) return 'Loading...'
  return fileName ? `Replace file '${fileName}'` : title
}

const defaultTitle = 'Pick a libp2p protobuf file'

function UploadDataButton({ onLoad, title = defaultTitle, overrides = {} }) {
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const { dispatchDataset } = useContext(SetterContext)
  const fileInputRef = useRef()

  function handleUpload(event) {
    const file = event.target.files[0]
    uploadDataFile(
      file,
      handleUploadStart,
      handleUploadFinish,
      handleUploadChunk
    )
  }

  function handleClick() {
    fileInputRef.current.click()
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
    if (onLoad) onLoad()
  }

  const buttonText = getButtonText(isLoading, fileName, title)

  return (
    <Container as={overrides.Container}>
      <FileButton onClick={handleClick} as={overrides.FileButton}>
        {buttonText}
      </FileButton>
      <NativeFileInput
        ref={fileInputRef}
        type="file"
        name="file"
        onChange={handleUpload}
        as={overrides.NativeFileInput}
      />
    </Container>
  )
}

UploadDataButton.propTypes = {
  onLoad: T.func,
  title: T.string.isRequired,
  overrides: T.object,
}

export default UploadDataButton
