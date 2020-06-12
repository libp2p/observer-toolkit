import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { renderWithTheme } from '@libp2p/observer-testing'

import Header from './Header'

describe('Header', () => {
  it('renders as expected', () => {
    const { asFragment } = renderWithTheme(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
