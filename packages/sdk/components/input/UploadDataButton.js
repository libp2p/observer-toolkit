import React, { useCallback, useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'

import { uploadDataFile } from '../../utils'
import { SourceContext, SetterContext } from '../context/DataProvider'

const FileButton = styled.button`
  cursor: pointer;
  position: relative;
  z-index: 5;
  font-weight: ${({ isDragActive }) => (isDragActive ? 800 : 'inherit')};
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

function getButtonText(isLoading, isDragActive, fileName, title) {
  if (isDragActive) return 'Drop file to upload'
  if (isLoading) return 'Loading...'
  return fileName ? `Replace file '${fileName}'` : title
}

const defaultTitle = 'Pick or drop libp2p protobuf file'

function UploadDataButton({ onLoad, title = defaultTitle, overrides = {} }) {
  const [isLoading, setIsLoading] = useState(false)
  const source = useContext(SourceContext)
  const fileName = source ? source.name : null
  const { removeData, updateData, updateSource } = useContext(SetterContext)

  const handleUpload = useCallback(
    files => {
      const onUploadStart = name => {
        removeData()
        updateSource({ type: 'upload', name })
        setIsLoading(true)
      }
      const onUploadFinish = file => {
        setIsLoading(false)
        if (onLoad) onLoad()
      }
      const onUploadChunk = data => {
        updateData(data)
      }
      files.forEach(file =>
        uploadDataFile(file, onUploadStart, onUploadFinish, onUploadChunk)
      )
    },
    [removeData, updateSource, onLoad, updateData]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
  })

  const buttonText = getButtonText(isLoading, isDragActive, fileName, title)

  return (
    <Container as={overrides.Container} {...getRootProps()}>
      <FileButton isDragActive={isDragActive} as={overrides.FileButton}>
        <NativeFileInput as={overrides.NativeFileInput} {...getInputProps()} />
        {buttonText}
      </FileButton>
    </Container>
  )
}

UploadDataButton.propTypes = {
  onLoad: T.func,
  title: T.string,
  overrides: T.object,
}

export default UploadDataButton
