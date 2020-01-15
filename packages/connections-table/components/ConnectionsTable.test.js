import React from 'react'
import { fireEvent } from '@testing-library/react'
import {
  loadSample,
  renderWithData,
  renderWithShell,
  within,
} from '@libp2p-observer/testing'
import { getConnections, getLatestTimepoint } from '@libp2p-observer/data'
import ConnectionsTable from './ConnectionsTable'

describe('ConnectionsTable', () => {
  const { states } = loadSample()
  const timepoint = getLatestTimepoint(states)
  const connections = getConnections(timepoint)

  it("has rows for each connection in sample's last timepoint, plus row of column headers", () => {
    const { getAllByRole } = renderWithData(<ConnectionsTable />)

    const rows = getAllByRole('row')
    expect(rows.length).toBeGreaterThan(1)
    expect(rows.length).toEqual(connections.length + 1)
  })

  it('makes row and corresponding shell paths active on hover', async () => {
    const { getByTestId } = renderWithShell(<ConnectionsTable />)

    const widget = within(getByTestId('widget'))
    const shell = within(getByTestId('shell'))
    const testHighlighting = isOn => {
      let highlightedRow, highlightedPaths
      if (isOn) {
        highlightedRow = widget.getByHighlighted()

        // 2 paths in shell, for data in and data out
        highlightedPaths = shell.getAllByHighlighted()
        expect(highlightedPaths).toHaveLength(2)
      } else {
        expect(widget.queryAllByHighlighted()).toHaveLength(0)
        expect(shell.queryAllByHighlighted()).toHaveLength(0)
      }

      return [highlightedRow, highlightedPaths]
    }

    // Extract first row after rows[0] which is headers row
    const rows = widget.getAllByRole('row')
    const firstDataRow = rows[1]

    // Nothing is highlighted initially
    testHighlighting(false)

    // Row and corresponding paths highlight on mouseover row
    await fireEvent.mouseEnter(firstDataRow)
    const [highlightedRow, highlightedPaths] = testHighlighting(true)
    expect(highlightedRow).toBe(firstDataRow)

    // Nothing is highlighted after mouseout
    await fireEvent.mouseLeave(firstDataRow)
    testHighlighting(false)

    // Same row and paths highlight on mouseover one of the paths
    const previouslyHighlightedPath = highlightedPaths[0]
    await fireEvent.mouseEnter(highlightedPaths[0])
    const [highlightedRowFromPath, highlightedPathsFromPath] = testHighlighting(
      true
    )
    expect(highlightedRowFromPath).toBe(firstDataRow)
    expect(highlightedPathsFromPath[0]).toBe(previouslyHighlightedPath)
  })
})
