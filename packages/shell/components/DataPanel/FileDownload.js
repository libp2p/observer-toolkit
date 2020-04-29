import React from 'react'
import styled from 'styled-components'

import { formatDataSize, useFileBlob } from '@libp2p-observer/sdk'

const StyledLink = styled.a`
  display: block;
  cursor: pointer;
  text-decoration: none;
  margin: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.color('highlight')};
  border: ${({ theme }) => theme.color('highlight')} 1px solid;
  ${({ theme }) => theme.text('body', 'large')}
`

function FileDownload() {
  const blob = useFileBlob()
  const blobURL = URL.createObjectURL(blob)
  const filename = `${Date.now()}.libp2p.trace`

  const [fileSize, sizeUnit] = formatDataSize(blob.size)

  return (
    <StyledLink href={blobURL} download={filename}>
      Download {fileSize} {sizeUnit}
    </StyledLink>
  )
}

export default FileDownload
