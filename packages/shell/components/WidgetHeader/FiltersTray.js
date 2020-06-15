import React, { useContext } from 'react'
import T from 'prop-types'
import styled, { css } from 'styled-components'
import isEqual from 'lodash.isequal'

import {
  useHidePrevious,
  FilterChip,
  FilterContext,
  FilterSetterContext,
  Icon,
  StyledButton,
} from '@libp2p/observer-sdk'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

const FiltersList = styled.div`
  display: flex;
`

const ToggleAllButton = styled(StyledButton)`
  padding: ${({ theme }) => theme.spacing([0.25, 1, 0.25, 0.5])};
  margin: ${({ theme }) => theme.spacing([1, 0])};
  color: ${({ theme, colorIndex }) => theme.color('text', colorIndex)};
  border-color: ${({ theme, colorIndex }) => theme.color('text', colorIndex)};
  ${({ theme, disabled }) =>
    disabled
      ? css`
          border: none;
          font-weight: 400;
        `
      : ''};
`

function FiltersTray({ overrides = {} }) {
  const { filters } = useContext(FilterContext)
  const dispatchFilters = useContext(FilterSetterContext)

  const hidePrevious = useHidePrevious()

  const setFilters = filters.filter(({ values, getFilterDef }) => {
    const { initialValues } = getFilterDef()
    return !isEqual(values, initialValues)
  })
  const areAllReset = !setFilters.length
  const areAllActive = setFilters.every(filter => filter.enabled)
  const areAllInactive = setFilters.every(filter => !filter.enabled)

  const toggleAllText =
    (areAllReset && 'All filters are unset') ||
    (areAllActive && 'Filters are enabled') ||
    (areAllInactive && 'Filters are disabled') ||
    'Some filters disabled'

  const iconType =
    (areAllActive && 'check') || (areAllInactive && 'uncheck') || 'mixed'

  const toggleAllColorIndex =
    ((areAllInactive || areAllReset) && 2) || (areAllActive ? 0 : 1)

  const handleFilterAll = () =>
    setFilters.forEach(filter =>
      dispatchFilters({
        action: areAllActive ? 'disable' : 'enable',
        name: filter.name,
      })
    )

  return (
    <Container>
      <FiltersList>
        {filters.map(filter => (
          <FilterChip
            filter={filter}
            key={filter.name}
            dispatchFilters={dispatchFilters}
            hidePrevious={hidePrevious}
          />
        ))}
      </FiltersList>
      <ToggleAllButton
        onClick={!areAllReset ? handleFilterAll : undefined}
        disabled={areAllReset}
        colorIndex={toggleAllColorIndex}
      >
        {!areAllReset && <Icon type={iconType} />}
        {toggleAllText}
      </ToggleAllButton>
    </Container>
  )
}

FiltersTray.propTypes = {
  isOpen: T.bool,
  overrides: T.object,
}

export default FiltersTray
