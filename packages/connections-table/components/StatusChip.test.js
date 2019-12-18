import React from 'react'
import renderer from 'react-test-renderer'
import { ThemeSetter } from '@libp2p-observer/sdk'
import StatusChip from './StatusChip'

describe('status chip', () => {
  it('throws if trying to render an invalid status', () => {
    expect(() => renderer.create(<StatusChip />)).toThrow(
      new Error('Status name "undefined" not recognised')
    )
  })

  it('renders ACTIVE status as expected', () => {
    const component = renderer.create(
      <ThemeSetter>
        <StatusChip status="ACTIVE" />
      </ThemeSetter>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
