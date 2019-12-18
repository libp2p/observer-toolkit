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

  it('calls onClick if clicked', () => {
    const mockFn = jest.fn()

    const elem = renderer.create(
      <ThemeSetter>
        <Icon type="asc" disabled={false} onClick={mockFn} />
      </ThemeSetter>
    )

    elem.root.find(c => c.type === 'span').props.onClick()

    expect(mockFn).toBeCalled()
  })

  it("doesn't call onClick if disabled", () => {
    const mockFn = jest.fn()

    const elem = renderer.create(
      <ThemeSetter>
        <Icon type="asc" disabled={true} onClick={mockFn} />
      </ThemeSetter>
    )

    expect(elem.root.find(c => c.type === 'span').props.onClick).toEqual(null)

    expect(mockFn).not.toBeCalled()
  })
})
