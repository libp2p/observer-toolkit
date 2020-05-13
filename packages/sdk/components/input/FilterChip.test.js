import React, { useContext } from 'react'
import T from 'prop-types'
import { fireEvent } from '@testing-library/react'

import { renderWithTheme, within } from '@nearform/observer-testing'

import {
  DataContext,
  DataProvider,
  FilterContext,
  FilterSetterContext,
  FilterProvider,
} from '../context'
import { getListFilter } from '../../filters'
import FilterChip from './FilterChip'

const mockAs = [
  { type: 'a', num: 2 },
  { type: 'a', num: 7 },
]
const mockBs = [
  { type: 'b', num: 4 },
  { type: 'b', num: 5 },
]
const mockCs = [
  { type: 'c', num: 6 },
  { type: 'c', num: 3 },
]
const mockData = [...mockAs, ...mockBs, ...mockCs]
mockData.forEach(datum => {
  // Add expected methods to fake states
  datum.getStartTs = () => {}
  datum.getInstantTs = () => {}
  datum.getSnapshotDurationMs = () => {}
})

const filterName = 'mock list filter'

const mockListFilter = getListFilter({
  name: filterName,
  mapFilter: datum => datum.type,
  // arbitrary non-alphabetical non-data order to ensure order is followed
  valueNames: ['b', 'a', 'c'],
})

function MockDataReceiver() {
  const data = useContext(DataContext)
  const { applyFilters } = useContext(FilterContext)
  const textContent = JSON.stringify(data.filter(applyFilters))
  return <div data-testid="output">{textContent}</div>
}

function FilterChipStack({ filterDef }) {
  return (
    <FilterProvider filterDefs={[filterDef]}>
      <DataProvider initialData={{ states: mockData }}>
        <FilterChipWrapper />
        <MockDataReceiver />
      </DataProvider>
    </FilterProvider>
  )
}
FilterChipStack.propTypes = {
  filterDef: T.object.isRequired,
}

function FilterChipWrapper() {
  const dispatchFilters = useContext(FilterSetterContext)
  const { filters } = useContext(FilterContext)
  return <FilterChip filter={filters[0]} dispatchFilters={dispatchFilters} />
}

describe('FilterChip', () => {
  it('renders, matching snapshot', () => {
    const { asFragment } = renderWithTheme(
      <FilterChipStack filterDef={mockListFilter} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('opens working list filter UI on click', async () => {
    const {
      findByText,
      getByRole,
      getByText,
      queryAllByRole,
    } = renderWithTheme(<FilterChipStack filterDef={mockListFilter} />)

    // No checkboxes, no filtering before clicking on chip
    expect(queryAllByRole('checkbox')).toHaveLength(0)
    expect(await findByText(JSON.stringify(mockData))).toBeTruthy()

    const chip = getByText(filterName)
    await fireEvent.click(chip)

    // Checkboxes are unmounted and created new when dialog opens / closes
    const queryCheckboxes = () =>
      within(getByRole('tooltip')).queryAllByRole('checkbox')
    const initialCheckboxes = queryCheckboxes()
    expect(initialCheckboxes).toHaveLength(4)

    // First ordinary checkbox should filter "b"s according to our b, a, c order
    await fireEvent.click(initialCheckboxes[1])
    expect(
      await findByText(JSON.stringify([...mockAs, ...mockCs]))
    ).toBeTruthy()

    // Second ordinary checkbox should filter "a"s as well as "b"s
    await fireEvent.click(initialCheckboxes[2])
    expect(await findByText(JSON.stringify(mockCs))).toBeTruthy()

    // Opening and closing the panel should not change what is filtered
    await fireEvent.click(chip)
    expect(queryAllByRole('tooltip')).toHaveLength(0)
    await fireEvent.click(chip)
    const secondCheckboxes = queryCheckboxes()
    expect(secondCheckboxes).toHaveLength(4)
    expect(await findByText(JSON.stringify(mockCs))).toBeTruthy()

    // Third ordinary checkbox should filter "c"s leaving nothing
    await fireEvent.click(secondCheckboxes[3])
    expect(await findByText(JSON.stringify([]))).toBeTruthy()
  })

  it('filters all when toggle-all button used', async () => {
    const { findByText, getByRole, getByText } = renderWithTheme(
      <FilterChipStack filterDef={mockListFilter} />
    )
    await fireEvent.click(getByText(filterName))
    const checkboxes = within(getByRole('tooltip')).getAllByRole('checkbox')
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).toBeChecked()
    expect(checkboxes[2]).toBeChecked()

    // First checkbox should filter everything
    await fireEvent.click(checkboxes[0])
    expect(await findByText(JSON.stringify([]))).toBeTruthy()
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
    expect(checkboxes[2]).not.toBeChecked()

    // Clicking an ordinary checkbox after filtering everything shows not hides
    await fireEvent.click(checkboxes[1])
    expect(await findByText(JSON.stringify(mockBs))).toBeTruthy()
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'mixed')
    expect(checkboxes[1]).toBeChecked()
    expect(checkboxes[2]).not.toBeChecked()

    // Clicking 'indeterminate' / 'mixed' toggle-all shows all
    await fireEvent.click(checkboxes[0])
    expect(await findByText(JSON.stringify(mockData))).toBeTruthy()
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).toBeChecked()
    expect(checkboxes[2]).toBeChecked()
  })

  it('disables but saves filters on disable, wipes on clear', async () => {
    const { findByText, getByRole, getByText } = renderWithTheme(
      <FilterChipStack filterDef={mockListFilter} />
    )
    await fireEvent.click(getByText(filterName))
    const checkboxes = within(getByRole('tooltip')).getAllByRole('checkbox')
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).toBeChecked()
    expect(checkboxes[2]).toBeChecked()

    // First checkbox should filter everything
    await fireEvent.click(checkboxes[0])
    expect(await findByText(JSON.stringify([]))).toBeTruthy()
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
    expect(checkboxes[2]).not.toBeChecked()

    // Clicking an ordinary checkbox after filtering everything shows not hides
    await fireEvent.click(checkboxes[1])
    expect(await findByText(JSON.stringify(mockBs))).toBeTruthy()
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'mixed')
    expect(checkboxes[1]).toBeChecked()
    expect(checkboxes[2]).not.toBeChecked()

    // Clicking 'indeterminate' / 'mixed' toggle-all shows all
    await fireEvent.click(checkboxes[0])
    expect(await findByText(JSON.stringify(mockData))).toBeTruthy()
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).toBeChecked()
    expect(checkboxes[2]).toBeChecked()
  })
})
