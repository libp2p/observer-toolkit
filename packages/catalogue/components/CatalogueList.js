import React, { useMemo } from 'react'
import styled from 'styled-components'
import T from 'prop-types'

import {
  useFilter,
  getStringFilter,
  getListFilter,
  FilterChip,
} from '@libp2p/observer-sdk'

const WidgetsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: middle;
`

const HeadingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing([0, 4])};
`

const Heading = styled.h1`
  color: ${({ theme }) => theme.color('text', 2, 0.6)};
  ${({ theme }) => theme.text('heading', 'extraLarge')}
`

const FiltersBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

import CatalogueItem from '../components/CatalogueItem'

function CatalogueList({ widgets, widgetIndex, setWidgetIndex }) {
  const allTags = useMemo(
    () =>
      widgets.reduce((tags, widget) => {
        const newTags = widget.tags || []
        return [...tags, ...newTags.filter(tag => !tags.includes(tag))]
      }, []),
    [widgets]
  )

  const filterDefs = [
    getStringFilter({
      name: 'Filter by name',
      mapFilter: widget => widget.name,
    }),
    getListFilter({
      name: 'Filter by tags',
      mapFilter: widget => widget.tags,
      valueNames: allTags,
    }),
  ]
  const { applyFilters, dispatchFilters, filters } = useFilter(filterDefs)

  const filteredWidgets = widgets.filter(applyFilters)

  return (
    <>
      <HeadingSection>
        <Heading>Select a widget:</Heading>
        <FiltersBlock>
          {filters.map(filter => (
            <FilterChip
              key={filter.name}
              filter={filter}
              dispatchFilters={dispatchFilters}
            />
          ))}
        </FiltersBlock>
      </HeadingSection>
      <WidgetsList>
        {filteredWidgets.map(
          ({ name, description, tags, screenshot }, index) => (
            <CatalogueItem
              key={name}
              name={name}
              description={description}
              tags={tags}
              screenshot={screenshot}
              handleSelect={() =>
                setWidgetIndex(index === widgetIndex ? null : index)
              }
              tagFilter={filters[1]}
              dispatchFilters={dispatchFilters}
            />
          )
        )}
      </WidgetsList>
    </>
  )
}

CatalogueList.propTypes = {
  widgets: T.array.isRequired,
  widgetIndex: T.number,
  setWidgetIndex: T.func.isRequired,
}

export default CatalogueList
