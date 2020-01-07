import React from 'react'
import { renderWithTheme } from '@libp2p-observer/testing'
import StatusChip from './StatusChip'

describe('status chip', () => {
  it('throws if trying to render an invalid status', () => {
    expect(() =>
      renderWithTheme(<StatusChip status="invalid status" />)
    ).toThrow(
      new Error(
        'Chip option "invalid status" not in "ACTIVE", "OPENING", "CLOSING", "CLOSED", "ERROR"'
      )
    )
  })

  it('renders ACTIVE status as expected', () => {
    const { asFragment } = renderWithTheme(<StatusChip status="ACTIVE" />)
    expect(asFragment()).toMatchSnapshot()
  })
})
