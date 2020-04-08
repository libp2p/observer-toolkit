import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import ReactJson from 'react-json-view'
import {
  copyToClipboard,
  Icon,
  StyledButton,
  Tooltip,
} from '@libp2p-observer/sdk'

import { RenderTime } from './contentRenderers'

const RawJsonContainer = styled.div`
  display: flex;
  align-items: center;
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

const ExpandIcon = styled.span`
  transform: rotate(90deg);
  margin-right: ${({ theme }) => theme.spacing(-1)};
  [data-tooltip='open'] > button > & {
    transform: rotate(180deg);
  }
  ${({ theme }) => theme.transition({ property: 'transform' })}
`

const ExpandButton = styled(StyledButton)`
  ${({ theme }) => theme.transition()}
  [data-tooltip="open"] > & {
    background: ${({ theme }) => theme.color('background', 1)};
  }
`

function EventPropertyHeader({ typeData, dispatchPropertyTypes }) {
  const handleRemove = e => {
    e.stopPropagation()
    dispatchPropertyTypes({
      action: 'disable',
      data: typeData,
    })
  }
  return (
    <Tooltip
      fixOn="never"
      content={<button onClick={handleRemove}>Remove</button>}
    >
      {typeData.name}
    </Tooltip>
  )
}
EventPropertyHeader.propTypes = {
  typeData: T.object.isRequired,
  dispatchPropertyTypes: T.func.isRequired,
}

function TimeContent({ value }) {
  return <RenderTime content={value} />
}
TimeContent.propTypes = {
  value: T.string,
}

function RawJsonTruncated({ value = '' }) {
  return (
    <Tooltip
      side="bottom"
      fixOn="no-hover"
      toleranceY={null}
      toleranceX={-32}
      content={<RawJsonExpanded value={value} />}
    >
      <ExpandButton>
        Show JSON
        <Icon type="expand" override={{ Container: ExpandIcon }} />
      </ExpandButton>
    </Tooltip>
  )
}
RawJsonTruncated.propTypes = {
  value: T.string,
}

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

export { EventPropertyHeader, TimeContent, RawJsonTruncated }
