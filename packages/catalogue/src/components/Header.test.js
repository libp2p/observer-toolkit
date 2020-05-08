import React from 'react'

import { renderWithTheme } from '@libp2p/observer-testing'

import Header from './Header'

describe('Header', () => {
  it('renders as expected', () => {
    const { asFragment } = renderWithTheme(<Header />)
    expect(asFragment()).toMatchSnapshot()
  })
})
