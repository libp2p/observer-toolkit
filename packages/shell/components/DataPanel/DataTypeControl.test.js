import React from 'react'
import T from 'prop-types'

import { fireEvent } from '@testing-library/react'

import {
  catchErrorSilently,
  renderWithTheme,
  getMockRuntime,
} from '@nearform/observer-testing'
import { DataProvider } from '@nearform/observer-sdk'
import DataTypeControl from './DataTypeControl'

const initialData = {
  runtime: getMockRuntime(),
}

function DataTypeWithSource({ source, openDataTray = () => {} }) {
  return (
    <DataProvider initialSource={source} initialData={initialData}>
      <DataTypeControl openDataTray={openDataTray} />
    </DataProvider>
  )
}
DataTypeWithSource.propTypes = {
  source: T.object.isRequired,
  openDataTray: T.any,
}

describe('DataTypeControl', () => {
  it('renders as expected for sample data', () => {
    const source = {
      type: 'sample',
      name: 'test sample name',
    }
    const { asFragment } = renderWithTheme(
      <DataTypeWithSource source={source} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders as expected for uploaded file', () => {
    const source = {
      type: 'upload',
      name: 'test filename',
    }
    const { asFragment } = renderWithTheme(
      <DataTypeWithSource source={source} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('throws if trying to render an invalid type', () => {
    const source = {
      type: 'invalid-type',
      name: 'test invalid type',
    }
    expect(
      catchErrorSilently(() =>
        renderWithTheme(<DataTypeWithSource source={source} />)
      )
    ).toBeInstanceOf(Error)
  })

  it('is highlighted and text changes on mouseover', async () => {
    const name = 'test mouseover target'
    const highlightedText = 'Change data source'

    const source = {
      type: 'sample',
      name,
    }
    const {
      getByText,
      queryAllByText,
      queryAllByHighlighted,
    } = renderWithTheme(<DataTypeWithSource source={source} />)
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
