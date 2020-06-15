import React from 'react'
import T from 'prop-types'
import ReactMarkdown from 'react-markdown'

import styled from 'styled-components'

const CatalogueCard = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color('background')};
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
  ${({ theme }) => theme.boxShadow()}
  :focus {
    outline: 4px solid ${({ theme }) => theme.color('highlight')};
  }
`

const CardContent = styled.div`
  padding: 0 ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(2)}`};
  flex-grow: 1;
  ${({ theme }) => theme.text('body', 'medium')}
`

const Tag = styled.li`
  margin: ${({ theme }) => `${theme.spacing(0.5)}`};
  padding: ${({ theme }) => `${theme.spacing(0.5)}`};
  list-style: none;
  display: inline-block;
  ${({ theme }) => theme.text('label', 'medium', theme.color('text', 0, 0.8))}
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
  color: ${({ theme }) => theme.color('contrast', 2)};
  ${({ theme }) => theme.text('heading', 'large')}
  margin-top: ${({ theme }) => theme.spacing(2)};
`

function CatalogueItem({ name, description, tags, handleSelect, screenshot }) {
  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.keyCode === 13) handleSelect()
  }
  return (
    <CatalogueCard
      onClick={handleSelect}
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      <StyledImg src={screenshot} />
      <CardContent>
        <StyledHeader>{name}</StyledHeader>
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
