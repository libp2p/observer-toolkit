import React from 'react'
import { fireEvent } from '@testing-library/react'
import { renderWithTheme } from '@libp2p-observer/testing'
import Icon from './Icon'

describe('Icon', () => {
  it('throws if trying to render an invalid icon', () => {
    expect(() => renderWithTheme(<Icon type="invalid icon type" />)).toThrow(
      new Error('No icon found named "invalid icon type"')
    )
  })

  it("renders 'asc' icon as expected", () => {
    const { asFragment } = renderWithTheme(<Icon type="asc" disabled={true} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('acts as button calling onClick if clicked', () => {
    const mockFn = jest.fn()

    const { getByRole } = renderWithTheme(
      <Icon type="asc" disabled={false} onClick={mockFn} />
    )
    fireEvent.click(getByRole('button'))
    expect(mockFn).toBeCalled()
  })

  it("doesn't act as button or call onClick if disabled", () => {
    const mockFn = jest.fn()

    const { getByRole, queryByRole } = renderWithTheme(
      <Icon type="asc" disabled={true} onClick={mockFn} />
    )
    expect(queryByRole('button')).toBeNull()

    fireEvent.click(getByRole('img'))
    expect(mockFn).not.toBeCalled()
  })
})
