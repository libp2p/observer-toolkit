import React from 'react'
import renderer from 'react-test-renderer'
import { ThemeSetter } from '@libp2p-observer/sdk'
import Icon from './Icon'

describe('Icon', () => {
  it('throws if trying to render an invalid icon', () => {
    expect(() => renderer.create(<Icon type="" />)).toThrow(
      new Error('No icon found named ""')
    )
  })

  it("renders 'asc' icon as expected", () => {
    const component = renderer.create(
      <ThemeSetter>
        <Icon type="asc" disabled={true} />
      </ThemeSetter>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
