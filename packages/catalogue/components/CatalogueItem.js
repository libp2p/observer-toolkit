import React from 'react'
import styled, { withTheme } from 'styled-components'
import T from 'prop-types'
import ReactMarkdown from 'react-markdown'

import { Chip } from '@libp2p/observer-sdk'

function getChipProps(theme) {
  const colorKey = 'contrast'
  const colorIndex = 1
  return {
    color: theme.color(colorKey, colorIndex, 0.6),
    backgroundColor: theme.color(colorKey, colorIndex, 0.1),
  }
}

function getNewValues(values, tag) {
  return { ...values, [tag]: !values[tag] }
}

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

function CatalogueItem({
  name,
  description,
  tags,
  handleSelect,
  screenshot,
  tagFilter,
  dispatchFilters,
  theme,
}) {
  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.keyCode === 13) handleSelect()
  }

  const chipProps = getChipProps(theme)

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
          <Chip
            onClick={
              dispatchFilters
                ? event => {
                    event.stopPropagation()
                    dispatchFilters({
                      action: 'update',
                      name: tagFilter.name,
                      values: getNewValues(tagFilter.values, tag),
                    })
                  }
                : null
            }
            key={tag}
            margin={0.5}
            opacity={tagFilter && tagFilter.values[tag] ? 1 : 0.5}
            {...chipProps}
          >
            {tag}
          </Chip>
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
  tagFilter: T.object,
  dispatchFilters: T.func,
  theme: T.object,
}

export default withTheme(CatalogueItem)
