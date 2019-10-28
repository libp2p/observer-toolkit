import React from 'react'
import T from 'prop-types'
import ReactMarkdown from 'react-markdown'

import styled from 'styled-components'

const CatalogueCard = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color('light', 'light')};
  width: calc(100% - ${({ theme }) => theme.spacing(4)});
  @media (min-width: 480px) {
    width: calc(50% - ${({ theme }) => theme.spacing(4)});
  }
  @media (min-width: 960px) {
    width: calc(33% - ${({ theme }) => theme.spacing(4)});
  }
  @media (min-width: 1480px) {
    width: calc(25% - ${({ theme }) => theme.spacing(4)});
  }
  margin: ${({ theme }) => `${theme.spacing(2)}`};
  box-shadow: ${({ theme: { color, spacing } }) =>
    `0 0 ${spacing(2)} ${color('dark', 'light', 0.5)}`};
  ${({ theme, isSelected }) =>
    isSelected && `border: 4px solid ${theme.color('primary', 'mid')};`}
`

const CardContent = styled.div`
  padding: 0 ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(2)}`};
  flex-grow: 1;
`

const Tag = styled.li`
  margin: ${({ theme }) => `${theme.spacing(0.5)}`};
  padding: ${({ theme }) => `${theme.spacing(0.5)}`};
  list-style: none;
  display: inline-block;
  ${({ theme }) => theme.text('label', 'medium', theme.color('text', 'light'))}
  font-weight: 700;
`

const TagList = styled.ul`
  padding: 0 ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(2)}`};
  margin: ${({ theme }) => `${theme.spacing()}`};
  padding: 0;
`

const StyledImg = styled.img`
  width: 100%;
`

const StyledHeader = styled.h3`
  position: absolute;
  top: ${({ theme }) => theme.spacing()};
  left: ${({ theme }) => theme.spacing()};
`

const StyledHeaderInner = styled.span`
  padding: ${({ theme }) => theme.spacing()};
  display: inline-block;
  background: ${({ theme }) => theme.color('dark', 'mid', 0.8)};
  color: ${({ theme }) => theme.color('light', 'light')};
  line-height: 1em;
`

function CatalogueItem({
  isSelected,
  name,
  description,
  tags,
  handleSelect,
  screenshot,
}) {
  return (
    <CatalogueCard onClick={handleSelect} isSelected={isSelected}>
      <StyledImg src={screenshot} />
      <StyledHeader>
        <StyledHeaderInner>{name}</StyledHeaderInner>
      </StyledHeader>
      <CardContent>
        <ReactMarkdown source={description} />
      </CardContent>
      <TagList>
        {tags.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </TagList>
    </CatalogueCard>
  )
}

CatalogueItem.propTypes = {
  isSelected: T.bool,
  name: T.string,
  description: T.string, // Markdown string from .md file and webpack raw-loader
  tags: T.array,
  handleSelect: T.func,
  screenshot: T.any,
}

export default CatalogueItem
