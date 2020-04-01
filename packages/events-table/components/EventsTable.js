import React, { useContext } from 'react'

import { getTime } from '@libp2p-observer/data'
import {
  DataTable,
  EventsContext,
  TimeContext,
  useTabularData,
} from '@libp2p-observer/sdk'

import eventsColumnDefs from '../definitions/eventsColumns'

let lastTime = performance.now()

function EventsTable() {
  const timepoint = useContext(TimeContext)
  const time = getTime(timepoint)
  const allEvents = useContext(EventsContext)
  const eventsData = allEvents.filter(
    event => event.getTs().getSeconds() <= time
  )

  const {
    columnDefs,
    contentProps,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
  } = useTabularData({
    columns: eventsColumnDefs,
    data: eventsData,
    defaultSort: 'time',
  })

  const now = performance.now()
  console.log({
    ms: Math.round(now - lastTime),
    events: allEvents.length,
  })
  lastTime = now

  return (
    <DataTable
      contentProps={contentProps}
      columnDefs={columnDefs}
      sortColumn={sortColumn}
      setSortColumn={setSortColumn}
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
      limit={20}
    />
  )
}

export default EventsTable
