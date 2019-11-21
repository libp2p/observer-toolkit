import React, { useState, useReducer, useRef, createContext } from 'react'
import T from 'prop-types'

import { getLatestTimepoint } from '@libp2p-observer/data'

const SetterContext = createContext()

const DataContext = createContext()

const TimeContext = createContext()

const PeerContext = createContext()

function updateData(oldData, { action, data }) {
  switch (action) {
    case 'append':
      return appendToDataSet(data, oldData)
    case 'replace':
      return replaceDataSet(data)
    case 'remove':
      return []
    default:
      throw new Error(`Action "${action}" not valid`)
  }
}

function appendToDataSet(newData, oldData) {
  // TODO: Update protobuf, then check peer Id matches
  // If not, replace dataset
  // Else, see if this timestamp already exists
  // If it does, replace. Else, append
  return [...oldData, ...newData]
}

function replaceDataSet(data) {
  // E.g. after uploading a new file or connecting to a new source
  return data
}

function DataProvider({
  initialData = [],
  initialTime = getLatestTimepoint(initialData),
  children,
}) {
  const [dataset, dispatchDataset] = useReducer(updateData, initialData)
  const [timepoint, setTimepoint] = useState(initialTime)

  // Select a timepoint after a new dataset is added
  if (dataset.length && (!timepoint || !dataset.includes(timepoint))) {
    const latestTimepoint = getLatestTimepoint(dataset)

    if (dataset.includes(latestTimepoint)) {
      setTimepoint(latestTimepoint)
    } else {
      // Should be unreachable but if a bug is introduced, could cause an infinite rerender if allowed
      throw new Error('Selected a timepoint not in the current dataset')
    }
  }

  // TODO: It's theoretically possible to have multiple connections to the same peer
  // - investigate using a connection id vs highlighting all connections to a peer
  const [peerId, setPeerId] = useState(null)

  // This is structured to avoid re-renders disrupting user interactions e.g. unfocusing input

  // Make the bundling object persist, as defining the object in normal function flow
  // causes context `value` to see a new object each run, causing re-renders every time
  const dataSetters = useRef({
    dispatchDataset,
    setTimepoint,
    setPeerId,
  })

  // Separate getters and setters so that components can set a context value without
  // then rerendering themselves because their useContext hook consumes that value
  return (
    <DataContext.Provider value={dataset}>
      <TimeContext.Provider value={timepoint}>
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
