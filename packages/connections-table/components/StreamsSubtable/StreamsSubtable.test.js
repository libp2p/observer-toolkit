import React from 'react'
import { loadSample, renderWithData, within } from '@nearform/observer-testing'
import {
  getConnections,
  getStreams,
  getLatestTimepoint,
} from '@nearform/observer-data'
import StreamsSubtable from './StreamsSubtable'
import WidgetContext from '../context/WidgetContext'

describe('StreamsSubtable', () => {
  const {
    data: { states },
  } = loadSample()
  const timepoint = getLatestTimepoint(states)

  const [connection] = getConnections(timepoint)
  const StreamsSubtableInContext = () => (
    <WidgetContext>
      <StreamsSubtable connection={connection} />
    </WidgetContext>
  )

  it('has a row for each stream in the connection, paginated', () => {
    const { getAllByTableRow, getByRole } = renderWithData(
      <StreamsSubtableInContext />
    )
    const streamsCount = getStreams(connection).length
    const rows = getAllByTableRow()
    const perPage = getByRole(/(listbox|combobox)/, {
      selector: '[name="PerPage"]',
    })
    const [perPageSelectedOption] = [
      ...within(perPage).getAllByRole('option'),
    ].filter(elem => elem.value === perPage.value)
    const rowsPerPage = Number(perPageSelectedOption.textContent)

    expect(rows).toHaveLength(Math.min(streamsCount, rowsPerPage))
  })
})
