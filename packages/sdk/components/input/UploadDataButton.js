import React, { useContext, useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { parseBuffer } from '@libp2p-observer/proto'
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

function UploadDataButton({ title }) {
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const { dispatchDataset } = useContext(SetterContext)
  const fileInputRef = useRef()

  function handleClick() {
    fileInputRef.current.click()
  }

  function handleUpload(event) {
    const reader = new FileReader()
    const file = event.target.files[0]
    if (!file) return

    reader.onload = e => handleUploadComplete(e, file.name)
    reader.readAsArrayBuffer(file)
    setIsLoading(true)
  }

  function handleUploadComplete(event, newFileName) {
    const bin = event.currentTarget.result
    const buf = Buffer.from(bin)
    const data = parseBuffer(buf)
    dispatchDataset({
      action: 'replace',
      data,
    })
    setIsLoading(false)
    setFileName(newFileName)
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

UploadDataButton.propTypes = {
  title: T.string.isRequired,
}

export default UploadDataButton
