import React, { useState, useReducer, useRef, createContext } from 'react'
import T from 'prop-types'

import { getLatestTimepoint } from 'proto'

const SetterContext = createContext()

const DataContext = createContext()

const TimeContext = createContext()

const PeerContext = createContext()

function updateData(action, newData, oldData) {
  const actions = ['append', 'replace']
  switch (actions.indexOf(action)) {
    case 0:
      return appendToDataSet(newData, oldData)
    case 1:
      return replaceDataSet(newData)
    default:
      throw new Error(`Action ${action} not one of "${actions.join(', ')}"`)
  }
}

function appendToDataSet(newData, oldData) {
  // TODO: Update protobuf, then check peer Id matches
  // If not, replace dataset
  // Else, see if this timestamp already exists
  // If it does, replace. Else, append
  return [...oldData, ...newData]
}

function replaceDataSet(newData) {
  // E.g. after uploading a new file or connecting to a new source
  return newData
}

function DataProvider({
  initialData = [],
  initialTime = getLatestTimepoint(initialData).getInstantTs(),
  children,
}) {
  const [dataset, dispatchDataset] = useReducer(updateData, initialData)
  const [time, setTime] = useState(initialTime)

  // TODO: It's theoretically possible to have multiple connections to the same peer
  // - investigate using a connection id vs highlighting all connections to a peer
  const [peerId, setPeerId] = useState(null)

  // This is structured to avoid re-renders disrupting user interactions e.g. unfocusing input

  // Make the bundling object persist, as defining the object in normal function flow
  // causes context `value` to see a new object each run, causing re-renders every time
  const dataSetters = useRef({
    dispatchDataset,
    setTime,
    setPeerId,
  })

  // Separate getters and setters so that components can set a context value without
  // then rerendering themselves because their useContext hook consumes that value
  return (
    <DataContext.Provider value={dataset}>
      <TimeContext.Provider value={time}>
        <PeerContext.Provider value={peerId}>
          <SetterContext.Provider value={dataSetters.current}>
            {children}
          </SetterContext.Provider>
        </PeerContext.Provider>
      </TimeContext.Provider>
    </DataContext.Provider>
  )
}

DataProvider.propTypes = {
  initialData: T.array,
  initialTime: T.number,
  children: T.node.isRequired,
}

export { DataProvider, SetterContext, DataContext, TimeContext, PeerContext }
