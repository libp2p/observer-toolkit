import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import getEventContent from '../utils/getEventContent'
import { RenderTime } from './contentRenderers'

const ContentsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing()};
  display: flex;
`

const ContentsItem = styled.div`
  margin: ${({ theme }) => theme.spacing([0, 2])};
  border: 2px solid ${({ theme }) => theme.color('background', 1)};
  display: flex;
  align-items: stretch;
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

function EventContent({ value = [], type }) {
  return (
    <ContentsContainer>
      {value.map(([contentKey, content]) => (
        <EventContentsItem
          key={`${type}:${contentKey}`}
          contentKey={contentKey}
          content={content}
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

export { TimeContent, EventContent }
