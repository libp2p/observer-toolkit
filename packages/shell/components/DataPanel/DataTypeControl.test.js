import React from 'react'

import { fireEvent } from '@testing-library/react'

import { catchErrorSilently, renderWithTheme } from '@libp2p-observer/testing'
import DataTypeControl from './DataTypeControl'

describe('DataTypeControl', () => {
  it('renders as expected for sample data', () => {
    const metadata = {
      type: 'sample',
      name: 'test sample name',
    }
    const { asFragment } = renderWithTheme(
      <DataTypeControl metadata={metadata} openDataTray={() => {}} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders as expected for uploaded file', () => {
    const metadata = {
      type: 'upload',
      name: 'test filename',
    }
    const { asFragment } = renderWithTheme(
      <DataTypeControl metadata={metadata} openDataTray={() => {}} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('throws if trying to render an invalid type', () => {
    const metadata = {
      type: 'invalid-type',
      name: 'test invalid type',
    }
    expect(
      catchErrorSilently(() =>
        renderWithTheme(
          <DataTypeControl metadata={metadata} openDataTray={() => {}} />
        )
      )
    ).toBeInstanceOf(Error)
  })

  it('is highlighted and text changes on mouseover', async () => {
    const name = 'test mouseover target'
    const highlightedText = 'Change data source'

    const metadata = {
      type: 'sample',
      name,
    }
    const {
      getByText,
      queryAllByText,
      queryAllByHighlighted,
    } = renderWithTheme(
      <DataTypeControl metadata={metadata} openDataTray={() => {}} />
    )
    expect(queryAllByHighlighted()).toHaveLength(0)
    expect(queryAllByText(highlightedText)).toHaveLength(0)

    await fireEvent.mouseEnter(getByText(name))
    expect(queryAllByHighlighted()).toHaveLength(1)
    expect(queryAllByText(highlightedText)).toHaveLength(1)
    expect(queryAllByText(name)).toHaveLength(0)

    await fireEvent.mouseLeave(getByText(highlightedText))
    expect(queryAllByHighlighted()).toHaveLength(0)
    expect(queryAllByText(highlightedText)).toHaveLength(0)
    expect(queryAllByText(name)).toHaveLength(1)
  })
})
