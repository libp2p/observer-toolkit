import React, { useContext, useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { parseBuffer } from 'proto'
import { SetterContext } from '../context/DataProvider'

const FileButton = styled.button`
  padding: ${({ theme }) => theme.spacing()};
  position: relative;
  z-index: 5;
  cursor: pointer;
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

function UploadData({ title }) {
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchDataset } = useContext(SetterContext)
  const fileInputRef = useRef()

  function handleClick() {
    fileInputRef.current.click()
  }

  function handleUpload(event) {
    const reader = new FileReader()
    reader.onload = handleUploadComplete
    reader.readAsArrayBuffer(event.target.files[0])
    setIsLoading(true)
  }

  function handleUploadComplete(event) {
    const bin = event.currentTarget.result
    const buf = Buffer.from(bin)
    const data = parseBuffer(buf)
    dispatchDataset({
      action: 'replace',
      data,
    })
    setIsLoading(false)
  }

  const buttonText = isLoading
    ? 'Loading...'
    : (fileInputRef.current && fileInputRef.current.value) || title

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

UploadData.propTypes = {
  title: T.string.isRequired,
}

export default UploadData
