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
} from '@libp2p-observer/sdk'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

const FiltersList = styled.div`
  display: flex;
`

const ToggleAllButton = styled(StyledButton)`
  padding: ${({ theme }) => theme.spacing()};
  ${({ theme, disabled }) =>
    disabled
      ? css`
          border: none;
          font-weight: 400;
        `
      : ''}
`

function FiltersTray({ overrides = {} }) {
  const { filters } = useContext(FilterContext)
  const dispatchFilters = useContext(FilterSetterContext)

  const hidePrevious = useHidePrevious()

  const areAllActive = filters.every(filter => filter.enabled)
  const areAllReset = filters.every(({ values, getFilterDef }) => {
    const { initialValues } = getFilterDef()
    return isEqual(values, initialValues)
  })

  const toggleAllText =
    (areAllReset && 'All filters are unset') ||
    `${areAllActive ? 'Disable' : 'Enable'} all filters`
  const handleFilterAll = () =>
    filters.forEach(filter =>
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
      >
        {!areAllReset && (
          <Icon
            active={areAllActive}
            type={areAllActive ? 'check' : 'uncheck'}
          />
        )}
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
