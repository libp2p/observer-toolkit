import React from 'react'
import { act, fireEvent, wait } from '@testing-library/react'
import { renderForSDK, within } from '@libp2p-observer/testing'

import { ThemedMockDataTable } from '../../test-fixtures/MockDataTable'

function getSlidingRows(nodes) {
  const slidingRows = nodes.reduce((rows, node) => {
    const row = node.querySelectorAll(':scope > table tr')
    return row.length === 1 ? [...rows, ...row] : rows
  }, [])
  return slidingRows
}

describe('DataTable', () => {
  it('Renders as expected, matching snapshot', () => {
    const { asFragment } = renderForSDK(<ThemedMockDataTable />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders cell contents correctly', () => {
    const { getByTableRow } = renderForSDK(<ThemedMockDataTable />)

    // Find by name cell
    const rowA = getByTableRow([{ column: 'Name of item', textContent: 'a' }])
    const rowA_numeric = within(rowA).getByTableColumn('Numeric cells')

    expect(rowA_numeric.textContent).toBe('3')

    const rowA_bool = within(rowA).getByTableColumn('mockBool')
    expect(rowA_bool.textContent).toBe('okay')
    expect(within(rowA_bool).queryAllByRole('alert')).toHaveLength(0)

    const rowA_percent = within(rowA).getByTableColumn('mockPercentCalc')
    expect(rowA_percent.textContent).toBe('10%')

    // Find by number cell
    const rowB = getByTableRow([{ column: 'Numeric cells', numericContent: 4 }])
    const rowB_name = within(rowB).getByTableColumn('Name of item')
    expect(rowB_name.textContent).toBe('b')

    const rowB_bool = within(rowB).getByTableColumn('mockBool')
    expect(rowB_bool.textContent).toBe('ALERT!')
    expect(within(rowB_bool).queryAllByRole('alert')).toHaveLength(1)

    const rowB_percent = within(rowB).getByTableColumn('mockPercentCalc')
    expect(rowB_percent.textContent).toBe('40%')
  })

  it('Renders cells in correct default order', () => {
    const { getAllByTableColumn } = renderForSDK(<ThemedMockDataTable />)

    const nameCol = getAllByTableColumn('Name of item')
    const nameColContent = nameCol.map(cell => cell.textContent)
    expect(nameColContent).toEqual(['a', 'b', 'c', 'd', 'e'])

    const numCol = getAllByTableColumn('Numeric cells')
    const numColContent = numCol.map(cell => Number(cell.textContent))
    expect(numColContent).toEqual([3, 4, 2, 5, 1])
  })

  it('Changes cell order on clicking sort column headers', async () => {
    const {
      findAllByRole,
      getByText,
      getAllByTableColumn,
      queryAllByRole,
    } = renderForSDK(<ThemedMockDataTable />)

    await act(async () => {
      await fireEvent.click(getByText('Numeric cells'))
    })
    // rows except 'b' and 'e' should slide
    expect(getSlidingRows(await findAllByRole('presentation'))).toHaveLength(3)
    expect(queryAllByRole('table')).toHaveLength(4)

    // wait for sliding to complete and sliding rows to be erased
    await wait(() => {
      expect(queryAllByRole('table')).toHaveLength(1)
    })

    const nameCol = getAllByTableColumn('Name of item')
    const nameColContent = nameCol.map(cell => cell.textContent)
    expect(nameColContent).toEqual(['d', 'b', 'a', 'c', 'e'])

    const numCol = getAllByTableColumn('Numeric cells')
    const numColContent = numCol.map(cell => Number(cell.textContent))
    expect(numColContent).toEqual([5, 4, 3, 2, 1])
  })

  it('Sort persists and updates as datum changes', async () => {
    const {
      findAllByRole,
      getByText,
      queryAllByRole,
      queryByRole,
    } = renderForSDK(<ThemedMockDataTable />)

    await act(async () => {
      await fireEvent.click(getByText('Numeric cells'))
    })

    await wait(() => {
      expect(queryAllByRole('table')).toHaveLength(1)
    })

    await act(async () => {
      await fireEvent.click(getByText('Select [0]'))
    })

    expect(getSlidingRows(await findAllByRole('presentation'))).toHaveLength(2)

    await wait(() => {
      expect(queryAllByRole('table')).toHaveLength(1)
    })

    const table = queryByRole('table')

    const nameCol = within(table).getAllByTableColumn('Name of item')
    const nameColContent = nameCol.map(cell => cell.textContent)
    expect(nameColContent).toEqual(['d', 'b', 'a', 'e', 'c'])

    const numCol = within(table).getAllByTableColumn('Numeric cells')
    const numColContent = numCol.map(cell => Number(cell.textContent))
    expect(numColContent).toEqual([5, 4, 3, 1, 0])
  })
})
