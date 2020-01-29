import React from 'react'

import { fireEvent, act, render } from '@testing-library/react'

import { loadSample, within } from '@libp2p-observer/testing'
import { getConnections, getLatestTimepoint } from '@libp2p-observer/data'
import App from './App'

const { states } = loadSample()
const timepoint = getLatestTimepoint(states)
const connections = getConnections(timepoint)

describe('App', () => {
  it('can click through to a widget with sample data applied', async () => {
    const { getByText, findByText, findByRole } = render(<App />)

    const samples = getByText(/^Sample data/i)
    await act(async () => {
      await fireEvent.click(samples)
    })

    const minute = getByText(/^1 minute/i)
    await act(async () => {
      await fireEvent.click(minute)
    })

    const widgetDesc = await findByText(/^Connections table/i)
    await act(async () => {
      await fireEvent.click(widgetDesc)
    })

    const connectionsTable = await findByRole('table')
    expect(connectionsTable).toBeInTheDocument()

    // Confirm data is applied to widget
    const rows = within(connectionsTable).getAllByTableRow()
    expect(rows).toHaveLength(connections.length)
  })
})
