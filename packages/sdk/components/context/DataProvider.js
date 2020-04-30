import React, { useState, useRef, createContext } from 'react'
import T from 'prop-types'

import { getEventType, getLatestTimepoint } from '@libp2p-observer/data'
import { useConsoleAPI, useDatastore, useFilter } from '../../hooks'
import { getListFilter, getRangeFilter } from '../../filters'

const SourceContext = createContext()
const DataContext = createContext()
const EventsContext = createContext()
const RuntimeContext = createContext()
const TimeContext = createContext()
const PeersContext = createContext()
const SetterContext = createContext()
const WebsocketContext = createContext()
const GlobalFilterContext = createContext()

function DataProvider({
  initialData: {
    states: initialStates = [],
    events: initialEvents = [],
    runtime: initialRuntime,
  } = {},
  initialSource,
  initialTime,
  children,
}) {
  const {
    // Data states
    states,
    events,
    runtime,
    peerIds,
    source,
    websocket,

    // Data setters
    updateData,
    replaceData,
    removeData,
    setPeerIds,
    setRuntime,
    setIsLoading,
    dispatchWebsocket,
  } = useDatastore({
    initialStates,
    initialEvents,
    initialRuntime,
    initialSource,
  })

  if (!initialTime) initialTime = getLatestTimepoint(states)
  const [timepoint, setTimepoint] = useState(null)

  useConsoleAPI({
    states,
    events,
    runtime,
    source,
    websocket,
    timepoint,
  })

  const filterDefs = [
    getRangeFilter({
      name: 'Filter by time',
      mapFilter: msg => (msg.getTs ? msg.getTs() : msg.getInstantTs()),
      min: states.length ? states[0].getInstantTs() : 0,
      max: states.length ? states[states.length - 1].getInstantTs() : 0,
      stepInterval: 100,
    }),
    getListFilter({
      name: 'Filter event types',
      mapFilter: msg => {
        if (!msg.getType) return null
        const eventType = getEventType(msg)
        return eventType || null
      },
      valueNames: runtime
        ? runtime.getEventTypesList().map(type => type.getName())
        : [],
    }),
  ]

  const {
    applyFilters,
    dispatchFilters: dispatchGlobalFilters,
    filters: globalFilters,
  } = useFilter(filterDefs)

  // Bundle setters and make bundle persist, as defining this in normal function flow
  // causes context `value` to see a new object each run, causing re-renders every time
  const dataSetters = useRef({
    setRuntime,
    setTimepoint,
    setPeerIds,
    updateData,
    replaceData,
    removeData,
    setIsLoading,
    dispatchWebsocket,
    dispatchGlobalFilters,
    globalFilters,
  })

  if (timepoint && !states.includes(timepoint)) {
    setTimepoint(null)
  }

  const displayedTimepoint = timepoint || initialTime || null

  const filteredStates = states.filter(applyFilters)
  const filteredEvents = events.filter(applyFilters)

  // Separate getters and setters so that components can set a context value without
  // then rerendering themselves because their useContext hook consumes that value
  return (
    <DataContext.Provider value={filteredStates}>
      <RuntimeContext.Provider value={runtime}>
        <TimeContext.Provider value={displayedTimepoint}>
          <EventsContext.Provider value={filteredEvents}>
            <PeersContext.Provider value={peerIds}>
              <SourceContext.Provider value={source}>
                <WebsocketContext.Provider value={websocket}>
                  <GlobalFilterContext.Provider value={globalFilters}>
                    <SetterContext.Provider value={dataSetters.current}>
                      {children}
                    </SetterContext.Provider>
                  </GlobalFilterContext.Provider>
                </WebsocketContext.Provider>
              </SourceContext.Provider>
            </PeersContext.Provider>
          </EventsContext.Provider>
        </TimeContext.Provider>
      </RuntimeContext.Provider>
    </DataContext.Provider>
  )
}

DataProvider.propTypes = {
  initialData: T.object,
  initialSource: T.shape({
    type: T.string,
    name: T.string,
  }),
  initialTime: T.number,
  children: T.node.isRequired,
}

export {
  DataProvider,
  DataContext,
  RuntimeContext,
  TimeContext,
  PeersContext,
  SetterContext,
  EventsContext,
  SourceContext,
  WebsocketContext,
  GlobalFilterContext,
}
