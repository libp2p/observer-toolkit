import React from 'react'
import T from 'prop-types'
import ReactMarkdown from 'react-markdown'

import styled from 'styled-components'

const CatalogueCard = styled.div`
  cursor: pointer;
  background-color: ${({ theme }) => theme.color('light', 'light')};
  border: 4px solid
    ${({ theme, isSelected }) =>
      theme.color(isSelected ? 'primary' : 'light', 'mid')};
  width: calc(50% - ${({ theme }) => theme.spacing(4)});
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(4)}`};
  margin: ${({ theme }) => `${theme.spacing(2)}`};
  box-shadow: ${({ theme: { color, spacing } }) =>
    `0 ${spacing(0.5)} ${spacing(2)} ${color('light', 'dark')}`};
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
  margin: ${({ theme }) => `${theme.spacing(0.5)} 0`};
  padding: 0;
`

function CatalogueItem({ isSelected, name, description, tags, handleSelect }) {
  return (
    <CatalogueCard onClick={handleSelect} isSelected={isSelected}>
      <h3>{name}</h3>
      <ReactMarkdown source={description} />
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
}

export default CatalogueItem
