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
  const {
    data: { states },
  } = loadSample()
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
      queryAllByTableRow,
      queryByTableRow,
      getByTestId,
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

    const showStreamsButton = within(row).getByText('View streams')

    // Expand its streams table
    await fireEvent.click(showStreamsButton)
    const subtableTooltip = within(row).getByRole('tooltip')
    expect(within(subtableTooltip).queryByRole('table')).toBeInTheDocument()

    // Nudge the time slider one to the left
    const timelineSlider = getByTestId('timeline-slider')
    await fireEvent.click(timelineSlider)
    await act(async () => {
      await fireEvent.keyDown(timelineSlider, { key: 'ArrowLeft', keyCode: 37 })
    })

    const row_2 = queryByTableRow([
      { column: /^peer id/i, textContent: peerId },
    ])

    // Check tooltip is still open
    const subtableTooltip_2 = within(row_2).getByRole('tooltip')
    expect(within(subtableTooltip_2).queryByRole('table')).toBeInTheDocument()

    // Check it closes as expected, and stays closed
    const hideStreamsButton = within(subtableTooltip_2).getByAriaLabel('Close')
    await fireEvent.click(hideStreamsButton)

    expect(within(row_2).queryByRole('tooltip')).not.toBeInTheDocument()

    // Do this after closing the tooltip else it'll find subtable rows
    const ageCell_2 = within(row_2).getByTableColumn(/^time open/i)
    const age_2 = parseFloat(ageCell_2.textContent)
    expect(age_2).toEqual(age - 1)

    await fireEvent.click(timelineSlider)
    await act(async () => {
      await fireEvent.keyDown(timelineSlider, { key: 'ArrowLeft', keyCode: 37 })
    })

    const row_3 = queryByTableRow([
      { column: /^peer id/i, textContent: peerId },
    ])

    expect(within(row_3).queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
