import React from 'react'
import T from 'prop-types'
import { fireEvent, waitForElement } from '@testing-library/react'

import {
  getListFilter,
  DataProvider,
  FilterProvider,
} from '@libp2p-observer/sdk'
import { renderWithData, within } from '@libp2p-observer/testing'

import WidgetHeader from './WidgetHeader'

const mockData = [{ type: 'a' }, { type: 'a' }, { type: 'b' }, { type: 'b' }]
const mockFilterName = 'test filter'

const mockWidgetName = 'test widget'
const mockWidgetDesc = 'description of widget'

const getType = datum => datum.type
const mockListFilter = getListFilter({
  name: mockFilterName,
  mapFilter: getType,
  valueNames: ['a', 'b'],
})

function MockWidgetStack({ filterDef, mockCloseFn = () => {} }) {
  return (
    <FilterProvider filterDefs={[filterDef]}>
      <DataProvider initialData={{ states: mockData }}>
        <WidgetHeader
          name={mockWidgetName}
          description={mockWidgetDesc}
          closeWidget={mockCloseFn}
        />
      </DataProvider>
    </FilterProvider>
  )
}
MockWidgetStack.propTypes = {
  filterDef: T.object.isRequired,
  mockCloseFn: T.func,
}

describe('WidgetHeader', () => {
  it('opens and closes on clicking button', async () => {
    const { getByText, queryAllByText, findAllByText } = renderWithData(
      <MockWidgetStack filterDef={mockListFilter} />
    )

    expect(queryAllByText(mockFilterName)).toHaveLength(0)
    const trayButton = getByText('0 active filters')
    expect(trayButton).toBeInTheDocument()

    await fireEvent.click(getByText('0 active filters'))
    const filterChip = await findAllByText(mockFilterName)
    expect(filterChip).toHaveLength(1)
    expect(trayButton).toBeInTheDocument()

    await fireEvent.click(getByText('0 active filters'))

    // React Slidedown relies on CSS transitions: mocking slide out completion would be futile
    // so instead look for the transitioning-out element being removed from semantic tree
    const closingChip = await waitForElement(() =>
      getByText(mockFilterName).closest('[aria-hidden=true]')
    )
    expect(closingChip).toBeInTheDocument()
  })

  it('updates tray button number and highlighting when a filter is active', async () => {
    const {
      getAllByRole,
      getByText,
      findByRole,
      findByText,
      queryAllByText,
    } = renderWithData(<MockWidgetStack filterDef={mockListFilter} />)

    const getTrayButton = text => {
      const buttons = getAllByRole('button')
      const targetButton = buttons.find(button =>
        within(button).queryByText(text)
      )
      if (!targetButton)
        throw new Error(`No element with role "button" has text "${text}"`)
      return targetButton
    }

    let trayButton = getTrayButton('0 active filters')
    expect(
      within(trayButton).queryAllByHighlighted(true, { includeSelf: true })
    ).toHaveLength(0)

    expect(queryAllByText('1 active filter')).toHaveLength(0)

    await fireEvent.click(trayButton)
    const filterButton = getByText(mockFilterName)

    await fireEvent.click(filterButton)
    const filterControls = await findByRole('tooltip')
    const checkboxes = within(filterControls).getAllByRole('checkbox')

    await fireEvent.click(checkboxes[0])
    await findByText('1 active filter')
    trayButton = getTrayButton('1 active filter')
    expect(trayButton).toHaveAttribute('data-highlighted')
    expect(
      within(trayButton).queryAllByHighlighted(true, { includeSelf: true })
    ).toHaveLength(1)

    expect(queryAllByText('1 active filter')).toHaveLength(1)
    expect(queryAllByText('0 active filters')).toHaveLength(0)
    expect(queryAllByText('1 active filters')).toHaveLength(0)

    await fireEvent.click(checkboxes[0])
    await findByText('0 active filters')
    trayButton = getTrayButton('0 active filters')
    expect(
      within(trayButton).queryAllByHighlighted(true, { includeSelf: true })
    ).toHaveLength(0)

    expect(queryAllByText('1 active filter')).toHaveLength(0)
  })

  it('fires closeWidget fn on clicking close button, with tooltip', async () => {
    const mockCloseFn = jest.fn()

    const { getByAriaLabel, queryAllByText } = renderWithData(
      <MockWidgetStack filterDef={mockListFilter} mockCloseFn={mockCloseFn} />
    )

    const closeButton = getByAriaLabel('Close')
    expect(closeButton).toBeInTheDocument()
    expect(queryAllByText(/Close and return/)).toHaveLength(0)

    await fireEvent.mouseEnter(closeButton)
    expect(queryAllByText(/Close and return/)).toHaveLength(1)

    await fireEvent.mouseLeave(closeButton)
    expect(queryAllByText(/Close and return/)).toHaveLength(0)

    await fireEvent.click(closeButton)
    expect(mockCloseFn).toHaveBeenCalled()
  })
})
