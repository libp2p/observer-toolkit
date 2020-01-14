import React, { useCallback, useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'

import { uploadDataFile } from '../../utils'
import { SetterContext } from '../context/DataProvider'

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
  const [fileName, setFileName] = useState('')
  const { dispatchDataset } = useContext(SetterContext)

  const handleUpload = useCallback(
    files => {
      const onUploadStart = () => setIsLoading(true)
      const onUploadFinished = file => {
        setIsLoading(false)
        setFileName(file.name)
        if (onLoad) onLoad()
      }
      const onUploadChunk = data => {
        dispatchDataset({
          action: 'replace',
          data,
        })
      }
      files.forEach(file => uploadDataFile(file, onUploadStart, onUploadFinished, onUploadChunk))
    },
    [dispatchDataset, setIsLoading, setFileName, onLoad]
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
  title: T.string.isRequired,
  overrides: T.object,
}

export default UploadDataButton
