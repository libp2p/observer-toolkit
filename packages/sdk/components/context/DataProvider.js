import React, { useState, useReducer, useRef, createContext } from 'react'
import T from 'prop-types'

import { getLatestTimepoint } from '@libp2p-observer/data'

const DataContext = createContext()
const RuntimeContext = createContext()
const TimeContext = createContext()
const PeerContext = createContext()
const SetterContext = createContext()

function updateData(oldData, { action, data }) {
  switch (action) {
    case 'append':
      return appendToDataSet(data, oldData)
    case 'replace':
      return replaceDataSet(data)
    case 'remove':
      return null
    default:
      throw new Error(`Action "${action}" not valid`)
  }
}

function appendToDataSet(newData, oldData) {
  // if no old data, replace
  if (!oldData) return newData

  // if runtime info, and different, replace
  if (
    oldData.runtime &&
    newData.runtime &&
    oldData.runtime.getPeerId() !== newData.runtime.getPeerId()
  )
    return newData

  // merge data
  const states = oldData.states.concat(newData.states)
  states.metadata = { ...oldData.states.metadata, ...newData.states.metadata }

  return { runtime: oldData.runtime, states }
}

function replaceDataSet(data) {
  // E.g. after uploading a new file or connecting to a new source
  return data
}

function DataProvider({ initialData = null, initialTime, children }) {
  // This is structured to avoid re-renders disrupting user interactions e.g. unfocusing input
  const [dataset, dispatchDataset] = useReducer(updateData, initialData)
  const [peerId, setPeerId] = useState(null)

  if (dataset && !initialTime) initialTime = getLatestTimepoint(dataset.states)
  const [timepoint, setTimepoint] = useState(initialTime)

  // Bundle setters and make bundle persist, as defining this in normal function flow
  // causes context `value` to see a new object each run, causing re-renders every time
  const dataSetters = useRef({
    dispatchDataset,
    setTimepoint,
    setPeerId,
  })

  const states = dataset ? dataset.states : []
  const runtime = dataset ? dataset.runtime : {}

  // Select a timepoint after a new dataset is added
  if (states.length && (!timepoint || !states.includes(timepoint))) {
    const latestTimepoint = getLatestTimepoint(states)

    if (states.includes(latestTimepoint)) {
      setTimepoint(latestTimepoint)
    } else {
      // Should be unreachable but if a bug is introduced, could cause an infinite rerender if allowed
      throw new Error('Selected a timepoint not in the current dataset')
    }
  }

  // Separate getters and setters so that components can set a context value without
  // then rerendering themselves because their useContext hook consumes that value
  return (
    <DataContext.Provider value={states}>
      <RuntimeContext.Provider value={runtime}>
        <TimeContext.Provider value={timepoint}>
          <PeerContext.Provider value={peerId}>
            <SetterContext.Provider value={dataSetters.current}>
              {children}
            </SetterContext.Provider>
          </PeerContext.Provider>
        </TimeContext.Provider>
      </RuntimeContext.Provider>
    </DataContext.Provider>
  )
}

DataProvider.propTypes = {
  initialData: T.object,
  initialTime: T.number,
  children: T.node.isRequired,
}

export {
  DataProvider,
  DataContext,
  RuntimeContext,
  TimeContext,
  PeerContext,
  SetterContext,
}
