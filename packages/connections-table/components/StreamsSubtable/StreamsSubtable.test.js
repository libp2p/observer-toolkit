import React from 'react'
import { loadSample, renderWithData } from '@libp2p-observer/testing'
import {
  getConnections,
  getStreams,
  getLatestTimepoint,
} from '@libp2p-observer/data'
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

  it('has a row for each stream in the connection', () => {
    const { getAllByTableRow } = renderWithData(<StreamsSubtableInContext />)
    const streamsCount = getStreams(connection).length
    const rows = getAllByTableRow()
    expect(rows).toHaveLength(streamsCount)
  })
})
