import React from 'react'
import { fireEvent, debug, prettyDOM } from '@testing-library/react'
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

  false &&
    it("has rows for each connection in sample's last timepoint, plus row of column headers", () => {
      const { getAllByRole } = renderWithData(<ConnectionsTable />)

      const rows = getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1)
      expect(rows.length).toEqual(connections.length + 1)
    })

  false &&
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
      const [
        highlightedRowFromPath,
        highlightedPathsFromPath,
      ] = testHighlighting(true)
      expect(highlightedRowFromPath).toBe(firstDataRow)
      expect(highlightedPathsFromPath[0]).toBe(previouslyHighlightedPath)
    })

  it('shows streams for a particular connection in streams subtable', async () => {
    const { findByText, getAllByText, queryAllByTableRow } = renderWithShell(
      <WidgetContext>
        <ConnectionsTable />
      </WidgetContext>
    )

    // Look up a row that has age > 1 s and streams > 0
    const suitableRows = queryAllByTableRow([
      { column: 'Age', numericContent: num => num >= 1 },
      { column: 'Streams', numericContent: num => num >= 2 },
    ])
    expect(suitableRows).not.toHaveLength(0)
    const row = suitableRows[0]

    const peerIdCell = within(row).getByTableColumn(/^peer id/i)
    const streamsCell = within(row).getByTableColumn(/^streams/i)
    const streamsButtonCell = within(row).getByTableColumn(-1)

    const peerId = peerIdCell.textContent

    console.log(streamsCell.textContent, parseInt(streamsCell.textContent))
    const streamsCount = parseInt(streamsCell.textContent)

    const showStreamsButton = within(row).getByText('View streams')
    console.log(prettyDOM(showStreamsButton))
    await fireEvent.click(showStreamsButton)

    const expandedHeading = await findByText(
      `Connection has ${streamsCount} streams:`
    )
    const expandedRow = expandedHeading.closest('tr')

    const subTablePeerIdChip = within(expandedRow).getByLabel(/^peer id/i)
    const subTablePeerId = subTablePeerIdChip.textContent
    expect(subTablePeerId).toEqual(peerId)

    // Get its peer Id
    // Open it
    // Check inner table row count matches streams cell
    // Check connection peer Id matches
    // Nudge timeline across
    // Check the right one is still open
    // Check it all still matches
  })
})
