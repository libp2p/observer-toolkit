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

async function getSuitableRows(getAllByRole, timelineSlider) {
  const table = getAllByRole('table').filter(
    // Filter out sliding rows
    table => table.querySelectorAll('th').length
  )[0]
  // Look up a row that has age > 1 s and streams > 0
  const rows = within(table).queryAllByTableRow([
    { column: /status/i, textContent: /active/i },
    { column: /time open/i, numericContent: num => num >= 1 },
    { column: /streams/i, numericContent: num => num >= 2 },
  ])

  if (rows.length) return rows

  // If no suitable rows, nudge slider left until we reach one
  await nudgeSliderLeft(timelineSlider)
  const olderRows = await getSuitableRows(getAllByRole, timelineSlider)
  return olderRows
}

async function nudgeSliderLeft(timelineSlider) {
  // Get the timeline slider in focus
  await fireEvent.click(timelineSlider)

  // Select previous state using left arrow keyboard shortcut
  await act(async () => {
    await fireEvent.keyDown(timelineSlider, { key: 'ArrowLeft', keyCode: 37 })
  })
}

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
    const { getAllByRole, getByTestId } = renderWithShell(
      <WidgetContext>
        <ConnectionsTable />
      </WidgetContext>
    )

    const timelineSlider = getByTestId('timeline-slider')
    const suitableRows = await getSuitableRows(getAllByRole, timelineSlider)
    expect(suitableRows).not.toHaveLength(0)

    const widget = within(getByTestId('widget'))
    const shell = within(getByTestId('shell'))
    const testHighlighting = isOn => {
      let highlightedRows, highlightedPaths
      if (isOn) {
        highlightedRows = widget.getAllByHighlighted()
        expect(highlightedRows.length).toBeTruthy()

        // 2 paths in shell, for data in and data out
        highlightedPaths = shell.getAllByHighlighted()
        expect(highlightedPaths).toHaveLength(highlightedRows.length * 2)
      } else {
        expect(widget.queryAllByHighlighted()).toHaveLength(0)
        expect(shell.queryAllByHighlighted()).toHaveLength(0)
      }

      return [highlightedRows, highlightedPaths]
    }

    // Extract first row after rows[0] which is headers row
    const rows = widget.getAllByRole('row')
    const firstDataRow = rows[1]

    // Nothing is highlighted initially
    testHighlighting(false)

    // Row and corresponding paths highlight on mouseover row
    await fireEvent.mouseEnter(firstDataRow)
    const [highlightedRows, highlightedPaths] = testHighlighting(true)
    expect(highlightedRows[0]).toBe(firstDataRow)

    // Nothing is highlighted after mouseout
    await fireEvent.mouseLeave(firstDataRow)
    testHighlighting(false)

    // Same row and paths highlight on mouseover one of the paths
    const previouslyHighlightedPath = highlightedPaths[0]
    await fireEvent.mouseEnter(highlightedPaths[0])
    const [
      highlightedRowsFromPath,
      highlightedPathsFromPath,
    ] = testHighlighting(true)
    expect(highlightedRowsFromPath[0]).toBe(firstDataRow)
    expect(highlightedPathsFromPath[0]).toBe(previouslyHighlightedPath)
  })

  it('shows streams for a particular connection in streams subtable', async () => {
    const { getByRole, getAllByRole, getByTestId } = renderWithShell(
      <WidgetContext>
        <ConnectionsTable />
      </WidgetContext>
    )

    const timelineSlider = getByTestId('timeline-slider')
    const suitableRows = await getSuitableRows(getAllByRole, timelineSlider)
    expect(suitableRows).not.toHaveLength(0)

    const table = getByRole('table')
    const row = suitableRows[0]

    // Get data items for chosen row
    const peerIdCell = within(row).getByTableColumn(/^peer id/i)
    const peerId = peerIdCell.textContent

    const ageCell = within(row).getByTableColumn(/^time open/i)
    const ageCellContent = within(ageCell).getByText(/\d+ ?\w+/)
    await fireEvent.mouseEnter(ageCellContent)
    const ageCellTooltip = await within(ageCell).findByRole('tooltip')
    const age_ms = parseFloat(ageCellTooltip.textContent)
    await fireEvent.mouseLeave(ageCellContent)

    const showStreamsButton = within(row).getByText('View streams')

    // Expand its streams table
    await fireEvent.click(showStreamsButton)
    const subtableTooltip = within(row).getByRole('tooltip')
    expect(within(subtableTooltip).queryByRole('table')).toBeInTheDocument()

    await nudgeSliderLeft(timelineSlider)

    const row_2 = within(table).queryAllByTableRow([
      { column: /^peer id/i, textContent: peerId },
    ])[0]

    // Check tooltip is still open
    const subtableTooltip_2 = within(row_2).getByRole('tooltip')
    expect(within(subtableTooltip_2).queryByRole('table')).toBeInTheDocument()

    // Check it closes as expected, and stays closed
    const hideStreamsButton = within(subtableTooltip_2).getByAriaLabel('Close')
    await fireEvent.click(hideStreamsButton)

    expect(within(row_2).queryByRole('tooltip')).not.toBeInTheDocument()

    // Do this after closing the tooltip else it'll find subtable rows
    const ageCell_2 = within(row_2).getByTableColumn(/^time open/i)
    const ageCellContent_2 = within(ageCell_2).getByText(/\d+ ?\w+/)
    await fireEvent.mouseEnter(ageCellContent_2)
    const ageCellTooltip_2 = await within(ageCell_2).findByRole('tooltip')

    const age_2_ms = parseFloat(ageCellTooltip_2.textContent)
    const msPerState = 2000
    expect(age_2_ms).toEqual(age_ms - msPerState)
    await fireEvent.mouseLeave(ageCellContent_2)

    await nudgeSliderLeft(timelineSlider)

    const row_3 = within(table).queryAllByTableRow([
      { column: /^peer id/i, textContent: peerId },
    ])[0]

    expect(within(row_3).queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
