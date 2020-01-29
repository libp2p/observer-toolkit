import React from 'react'
import { act, fireEvent } from '@testing-library/react'
import {
  loadSample,
  renderWithData,
  renderWithShell,
  within,
} from '@libp2p-observer/testing'
import { getConnections, getLatestTimepoint } from '@libp2p-observer/data'
import ConnectionsTable from './ConnectionsTable'
import WidgetContext from './context/WidgetContext'

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
    const { getByTestId } = renderWithShell(
      <WidgetContext>
        <ConnectionsTable />
      </WidgetContext>
    )

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

  it('shows streams for a particular connection in streams subtable', async () => {
    const {
      findByText,
      queryAllByTableRow,
      getByTestId,
      queryByText,
    } = renderWithShell(
      <WidgetContext>
        <ConnectionsTable />
      </WidgetContext>
    )

    // Look up a row that has age > 1 s and streams > 0
    const suitableRows = queryAllByTableRow([
      { column: /status/i, textContent: /active/i },
      { column: /time open/i, numericContent: num => num >= 1 },
      { column: /streams/i, numericContent: num => num >= 2 },
    ])
    expect(suitableRows).not.toHaveLength(0)

    const row = suitableRows[0]

    // Get data items for chosen row
    const peerIdCell = within(row).getByTableColumn(/^peer id/i)
    const peerId = peerIdCell.textContent

    const ageCell = within(row).getByTableColumn(/^time open/i)
    const age = parseFloat(ageCell.textContent)

    const streamsCell = within(row).getByTableColumn(/^streams/i)
    const streamsCount = parseInt(streamsCell.textContent)
    const showStreamsButton = within(row).getByText('View streams')

    // Expand its streams table
    await fireEvent.click(showStreamsButton)
    const expandedHeading = await findByText(
      `Connection has ${streamsCount} streams:`
    )
    const expandedRow = expandedHeading.closest('tr')

    // Check the data is for the correct connection
    const subTablePeerIdChip = within(expandedRow).getByLabelText(/^peer id/i)
    const subTablePeerId = subTablePeerIdChip.textContent
    expect(subTablePeerId).toEqual(peerId)

    // Nudge the time slider one to the left
    const timelineSlider = getByTestId('timeline-slider')
    await fireEvent.click(timelineSlider)
    await act(async () => {
      await fireEvent.keyDown(timelineSlider, { key: 'ArrowLeft', keyCode: 37 })
    })

    // Check the same connection is open with correct data showing
    const expandedHeading_2 = await findByText(/^Connection has \d+ streams/)
    const expandedRow_2 = expandedHeading_2.closest('tr')

    const subTablePeerIdChip_2 = within(expandedRow_2).getByLabelText(
      /^peer id/i
    )
    const subTablePeerId_2 = subTablePeerIdChip_2.textContent
    expect(subTablePeerId_2).toEqual(peerId)

    const ageCell_2 = within(expandedRow_2).getByLabelText(/^time open/i)
    const age_2 = parseFloat(ageCell_2.textContent)

    expect(age_2).toEqual(age - 1)

    // Check it closes as expected, and stays closed
    const hideStreamsButton = within(expandedRow_2).getByAriaLabel('Close')
    await fireEvent.click(hideStreamsButton)

    expect(queryByText(/^Connection has \d+ streams/)).not.toBeInTheDocument()

    await fireEvent.click(timelineSlider)
    await act(async () => {
      await fireEvent.keyDown(timelineSlider, { key: 'ArrowLeft', keyCode: 37 })
    })

    expect(queryByText(/^Connection has \d+ streams/)).not.toBeInTheDocument()
  })
})
