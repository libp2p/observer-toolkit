import React from 'react'
import renderer from 'react-test-renderer'
import { ThemeSetter } from '@libp2p-observer/sdk'
import DataTypeControl from './DataTypeControl'

describe('DataTypeControl', () => {
  it('renders as expected for sample data', () => {
    const metadata = {
      type: 'sample',
      name: 'test sample name',
    }
    const component = renderer.create(
      <ThemeSetter>
        <DataTypeControl metadata={metadata} />
      </ThemeSetter>
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders as expected for uploaded file', () => {
    const metadata = {
      type: 'upload',
      name: 'test filename',
    }
    const component = renderer.create(
      <ThemeSetter>
        <DataTypeControl metadata={metadata} />
      </ThemeSetter>
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('throws if trying to render an invalid type', () => {
    const metadata = {
      type: 'invalid-type',
      name: 'test invalid type',
    }

    expect(() =>
      renderer
        .create(
          <ThemeSetter>
            <DataTypeControl metadata={metadata} />
          </ThemeSetter>
        )
        .toThrow(
          new Error(
            'Unknown type "invalid-type", expected one of "sample", "upload"'
          )
        )
    )
  })
})
