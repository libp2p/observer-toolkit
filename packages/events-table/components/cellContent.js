import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import getEventContent from '../utils/getEventContent'
import parseJsonString from '../utils/parseJsonString'
import { RenderTime, RenderJsonString } from './contentRenderers'

const ContentsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing()};
  display: flex;
  flex-wrap: wrap;
`

const ContentsItem = styled.div`
  margin: ${({ theme }) => theme.spacing([0.25, 2])};
  border: 2px solid ${({ theme }) => theme.color('background', 1)};
  display: flex;
  align-items: stretch;
  min-width: ${({ theme }) => theme.spacing(20)};
  min-height: ${({ theme }) => theme.spacing(4)};
`

const ContentsContent = styled.div`
  padding: ${({ theme }) => theme.spacing([0.5, 1])};
  display: flex;
  align-items: center;
`

const ContentsLabel = styled.label`
  padding: ${({ theme }) => theme.spacing([0.5, 1])};
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-transform: uppercase;
  min-width: ${({ theme }) => theme.spacing(8)};
  background: ${({ theme }) => theme.color('background', 1)};
  color: ${({ theme }) => theme.color('contrast', 1)};
  ${({ theme }) => theme.text('label', 'small')}
`

function TimeContent({ value }) {
  return <RenderTime content={value} />
}
TimeContent.propTypes = {
  value: T.string,
}

function EventContent({ value = '', type }) {
  const content = parseJsonString(value)

  return (
    <ContentsContainer>
      {content.map(({ key, value }) => (
        <EventContentsItem
          key={`${type}:${key}`}
          contentKey={key}
          content={value}
          type={type}
        />
      ))}
    </ContentsContainer>
  )
}
EventContent.propTypes = {
  value: T.array,
  type: T.string,
}

function EventContentsItem({ contentKey, content, type }) {
  const { label, Renderer } = getEventContent(contentKey)

  return (
    <ContentsItem>
      <ContentsLabel>{label}</ContentsLabel>
      <ContentsContent>
        <Renderer content={content} type={type} />
      </ContentsContent>
    </ContentsItem>
  )
}
EventContentsItem.propTypes = {
  contentKey: T.string.isRequired,
  content: T.any, // Should be a string but be prepared for the unexpected
  type: T.string,
}

function RawJsonContent({ value = '' }) {
  // TODO: add expand button similar to connections table streams subtable
  return <RenderJsonString content={value} />
}
RawJsonContent.propTypes = {
  value: T.string,
}

export { TimeContent, EventContent, RawJsonContent }
