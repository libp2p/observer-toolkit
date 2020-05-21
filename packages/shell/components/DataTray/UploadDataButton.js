import React, { useCallback } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'

import { uploadDataFile, useHandlerOnRef } from '@libp2p/observer-sdk'

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

const defaultTitle = 'Pick or drop libp2p protobuf file'
const draggingTitle = 'Drop file to upload'

function UploadDataButton({
  handleUploadStart,
  handleUploadFinished,
  handleUploadChunk,
  iconRef,
}) {
  const handleUpload = useCallback(
    files => {
      files.forEach(file =>
        uploadDataFile(
          file,
          handleUploadStart,
          handleUploadFinished,
          handleUploadChunk
        )
      )
    },
    [handleUploadStart, handleUploadFinished, handleUploadChunk]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
  })

  const rootProps = getRootProps()
  const inputProps = getInputProps()

  useHandlerOnRef({
    targetRef: iconRef,
    handler: rootProps.onClick,
  })

  const buttonText = isDragActive ? draggingTitle : defaultTitle

  return (
    <Container {...rootProps}>
      <FileButton isDragActive={isDragActive}>
        <NativeFileInput {...inputProps} />
        {buttonText}
      </FileButton>
    </Container>
  )
}

UploadDataButton.propTypes = {
  handleUploadStart: T.func.isRequired,
  handleUploadFinished: T.func.isRequired,
  handleUploadChunk: T.func.isRequired,
  iconRef: T.object,
}

export default UploadDataButton
