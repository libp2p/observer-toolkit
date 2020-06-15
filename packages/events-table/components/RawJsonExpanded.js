import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import ReactJson from 'react-json-view'
import { copyToClipboard, StyledButton } from '@libp2p/observer-sdk'

const RawJsonContainer = styled.div`
  display: flex;
  align-items: center;
`

const CopyButton = styled(StyledButton)`
  margin: ${({ theme }) => theme.spacing([0, 1])};
`

const JsonContainer = styled.div`
  max-width: 900px;
  max-height: 450px;
  display: flex;
  flex-direction: column;
`

const JsonTreeContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
  padding-top: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  border-top: 1px solid ${({ theme }) => theme.color('background', 2)};
`
const RawJsonFull = styled.pre`
  flex-grow: 1;
  flex-shrink: 1;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: ${({ theme }) => theme.spacing([2, 1])};
  background: ${({ theme }) => theme.color('background', 1)};
  font-family: 'plex-mono';
`

function RawJsonExpanded({ value = '' }) {
  return (
    <JsonContainer>
      <RawJsonContainer>
        <RawJsonFull>{value}</RawJsonFull>
        <CopyButton onClick={() => copyToClipboard(value)}>Copy</CopyButton>
      </RawJsonContainer>
      <JsonTreeContainer>
        <ReactJson
          src={JSON.parse(value)}
          theme="bright:inverted"
          iconStyle="triangle"
        />
      </JsonTreeContainer>
    </JsonContainer>
  )
}
RawJsonExpanded.propTypes = {
  value: T.string,
}

export default RawJsonExpanded
