import React from 'react'
import { renderWithTheme } from '@libp2p-observer/testing'
import DataTypeControl from './DataTypeControl'

describe('DataTypeControl', () => {
  it('renders as expected for sample data', () => {
    const metadata = {
      type: 'sample',
      name: 'test sample name',
    }
    const { asFragment } = renderWithTheme(
      <DataTypeControl metadata={metadata} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders as expected for uploaded file', () => {
    const metadata = {
      type: 'upload',
      name: 'test filename',
    }
    const { asFragment } = renderWithTheme(
      <DataTypeControl metadata={metadata} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('throws if trying to render an invalid type', () => {
    const metadata = {
      type: 'invalid-type',
      name: 'test invalid type',
    }

    expect(() =>
      renderWithTheme
        .create(<DataTypeControl metadata={metadata} />)
        .toThrow(
          new Error(
            'Unknown type "invalid-type", expected one of "sample", "upload"'
          )
        )
    )
  })
})
