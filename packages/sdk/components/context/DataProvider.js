import React, { useState, useRef, createContext } from 'react'
import T from 'prop-types'

import { getLatestTimepoint } from '@libp2p-observer/data'
import { useDatastore } from '../../hooks'

const SourceContext = createContext()
const DataContext = createContext()
const EventsContext = createContext()
const RuntimeContext = createContext()
const TimeContext = createContext()
const PeersContext = createContext()
const SetterContext = createContext()

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

    // Data setters
    updateSource,
    updateData,
    replaceData,
    removeData,
    setPeerIds,
    setRuntime,
  } = useDatastore({
    initialStates,
    initialEvents,
    initialRuntime,
    initialSource,
  })

  if (!initialTime) initialTime = getLatestTimepoint(states)
  const [timepoint, setTimepoint] = useState(null)

  // Bundle setters and make bundle persist, as defining this in normal function flow
  // causes context `value` to see a new object each run, causing re-renders every time
  const dataSetters = useRef({
    setRuntime,
    setTimepoint,
    setPeerIds,
    updateSource,
    updateData,
    replaceData,
    removeData,
  })

  if (timepoint && !states.includes(timepoint)) {
    setTimepoint(null)
  }

  const displayedTimepoint = timepoint || initialTime || null

  // Separate getters and setters so that components can set a context value without
  // then rerendering themselves because their useContext hook consumes that value
  return (
    <DataContext.Provider value={states}>
      <RuntimeContext.Provider value={runtime}>
        <TimeContext.Provider value={displayedTimepoint}>
          <EventsContext.Provider value={events}>
            <PeersContext.Provider value={peerIds}>
              <SourceContext.Provider value={source}>
                <SetterContext.Provider value={dataSetters.current}>
                  {children}
                </SetterContext.Provider>
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
}
