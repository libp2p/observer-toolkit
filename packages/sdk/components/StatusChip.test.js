import React from 'react'
import { catchErrorSilently, renderWithTheme } from '@libp2p/observer-testing'
import StatusChip from './StatusChip'

describe('status chip', () => {
  it('throws if trying to render an invalid status', () => {
    expect(
      catchErrorSilently(() =>
        renderWithTheme(<StatusChip status="invalid status" />)
      )
    ).toBeInstanceOf(Error)
  })

  it('renders ACTIVE status as expected', () => {
    const { asFragment } = renderWithTheme(<StatusChip status="ACTIVE" />)
    expect(asFragment()).toMatchSnapshot()
  })
})
