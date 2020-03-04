import React, { useContext } from 'react'

import { getStringSorter } from '@libp2p-observer/sdk'

import { getTime } from '@libp2p-observer/data'
import {
  DataTable,
  EventsContext,
  TimeContext,
  useTabularData,
} from '@libp2p-observer/sdk'

import eventsColumnDefs from '../definitions/eventsColumns'

import getContentRenderer from '../utils/getContentRenderer'

const stringSorter = {
  getSorter: getStringSorter,
  defaultDirection: 'asc',
}

function EventsTable() {
  const timepoint = useContext(TimeContext)
  const time = getTime(timepoint)
  const allEvents = useContext(EventsContext)
  const eventsData = allEvents.filter(
    event => event.getTs().getSeconds() <= time
  )

  const allContentProps = allEvents.reduce((propNames, event) => {
    event
      .getContentMap()
      .getEntryList()
      .forEach(([name]) => propNames.add(name))
    return propNames
  }, new Set())

  const contentColumnDefs = [...allContentProps].map(propName => ({
    name: propName,
    getProps: event => {
      const content = event.getContentMap().getEntryList()
      const match = content.find(prop => prop[0] === propName)
      const value = match ? match[1] : null
      return {
        value,
        name: propName,
      }
    },
    renderContent: getContentRenderer(propName),
    sort: stringSorter,
  }))

  const dynamicColumnDefs = [...eventsColumnDefs, ...contentColumnDefs]

  const {
    columnDefs,
    contentProps,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
  } = useTabularData({
    columns: dynamicColumnDefs,
    data: eventsData,
    defaultSort: 'time',
  })

  return (
    <DataTable
      contentProps={contentProps}
      columnDefs={columnDefs}
      sortColumn={sortColumn}
      setSortColumn={setSortColumn}
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
    />
  )
}

export default EventsTable
