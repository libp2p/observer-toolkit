import React, { useState, useReducer, useRef, createContext } from 'react'
import T from 'prop-types'

import { getLatestTimepoint } from '@libp2p-observer/data'

const CUTOFF = 15000

const SourceContext = createContext()
const DataContext = createContext()
const EventsContext = createContext()
const RuntimeContext = createContext()
const TimeContext = createContext()
const PeersContext = createContext()
const SetterContext = createContext()

function updateStates(msg) {
  if (!msg.getStartTs || !msg.getSubsystems) {
    return msg
  }
  const stateTs = msg.getStartTs().getSeconds()
  const subsystems = msg.getSubsystems()
  const connections = subsystems.getConnectionsList()
  const cns = connections.filter(cn => {
    if (!cn.getTimeline().getCloseTs()) {
      return true
    }
    const closeTs = cn
      .getTimeline()
      .getCloseTs()
      .getSeconds()
    return stateTs - closeTs < CUTOFF
  })
  subsystems.setConnectionsList(cns)
  msg.setSubsystems(subsystems)
  return msg
}

function updateData(oldData, { action, data }) {
  switch (action) {
    case 'append':
      return appendToDataSet(data, oldData).map(updateStates)
    case 'replace':
      return replaceDataSet(data).map(updateStates)
    case 'remove':
      return []
    default:
      throw new Error(`Action "${action}" not valid`)
  }
}

function appendToDataSet(newData, oldData) {
  if (!oldData) return newData
  return [...oldData, ...newData]
}

function replaceDataSet(data) {
  // E.g. after uploading a new file or connecting to a new source
  return data
}

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
  // This is structured to avoid re-renders disrupting user interactions e.g. unfocusing input
  const [states, dispatchStates] = useReducer(updateData, initialStates)
  const [events, dispatchEvents] = useReducer(updateData, initialEvents)
  const [runtime, setRuntime] = useState(initialRuntime)
  const [peerIds, setPeerIds] = useState([])
  const [source, setSource] = useState(initialSource)

  if (!initialTime) initialTime = getLatestTimepoint(states)
  const [timepoint, setTimepoint] = useState(null)

  // Bundle setters and make bundle persist, as defining this in normal function flow
  // causes context `value` to see a new object each run, causing re-renders every time
  const dataSetters = useRef({
    dispatchStates,
    dispatchEvents,
    setRuntime,
    setTimepoint,
    setPeerIds,
    setSource,
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
