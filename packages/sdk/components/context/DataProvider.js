import React, { useMemo, useState, useRef, createContext } from 'react'
import T from 'prop-types'

import {
  getEventType,
  getLatestState,
  getStateRangeTimes,
} from '@nearform/observer-data'
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
  initialState,
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

  if (!initialState) initialState = getLatestState(states)
  const [currentState, setCurrentState] = useState(null)

  useConsoleAPI({
    states,
    events,
    runtime,
    source,
    websocket,
    currentState,
  })

  const { start, end } = getStateRangeTimes(states)

  const filterDefs = [
    getRangeFilter({
      name: 'Filter by time',
      mapFilter: msg =>
        msg.getTs ? msg.getTs() : msg.getInstantTs && msg.getInstantTs(),
      min: start,
      max: end,
      numberFieldType: 'time',
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
    setCurrentState,
    setPeerIds,
    updateData,
    replaceData,
    removeData,
    setIsLoading,
    dispatchWebsocket,
    dispatchGlobalFilters,
    globalFilters,
  })

  if (currentState && !states.includes(currentState)) {
    setCurrentState(null)
  }

  const displayedState = currentState || initialState || null

  const filteredStates = useMemo(() => states.filter(applyFilters), [
    states,
    applyFilters,
  ])
  const filteredEvents = useMemo(() => events.filter(applyFilters), [
    events,
    applyFilters,
  ])

  // Separate getters and setters so that components can set a context value without
  // then rerendering themselves because their useContext hook consumes that value
  return (
    <DataContext.Provider value={filteredStates}>
      <RuntimeContext.Provider value={runtime}>
        <TimeContext.Provider value={displayedState}>
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
  initialState: T.object,
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
