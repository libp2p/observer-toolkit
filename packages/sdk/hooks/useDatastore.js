import { useCallback, useReducer, useState } from 'react'

let CUTOFF_MS = 60000

function updateStoredData(data) {
  let latestTs = data
    .filter(msg => msg.getStartTs)
    .map(msg => msg.getStartTs().getSeconds())
    .sort()
    .pop()
  return data
    .filter(msg => {
      if (
        msg.getStartTs &&
        latestTs - msg.getStartTs().getSeconds() > CUTOFF_MS
      )
        return false
      return true
    })
    .map(msg => {
      if (!msg.getStartTs || !msg.getSubsystems) return msg
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
        return stateTs - closeTs < CUTOFF_MS
      })
      subsystems.setConnectionsList(cns)
      msg.setSubsystems(subsystems)
      return msg
    })
}

function handleDispatchData(oldData, { action, data }) {
  switch (action) {
    case 'append':
      return updateStoredData(appendToStoredData(data, oldData))
    case 'replace':
      return updateStoredData(replaceStoredData(data))
    case 'remove':
      return []
    default:
      throw new Error(`Action "${action}" not valid`)
  }
}

function appendToStoredData(newData, oldData) {
  if (!oldData) return newData
  return [...oldData, ...newData]
}

function replaceStoredData(data) {
  // E.g. after uploading a new file or connecting to a new source
  return data
}

function useDatastore({
  initialStates = [],
  initialEvents = [],
  initialRuntime,
  initialSource,
}) {
  const [states, dispatchStates] = useReducer(handleDispatchData, initialStates)
  const [events, dispatchEvents] = useReducer(handleDispatchData, initialEvents)
  const [runtime, setRuntime] = useState(initialRuntime)
  const [peerIds, setPeerIds] = useState([])
  const [source, setSource] = useState(initialSource)

  if (runtime && runtime.getKeepStaleDataMs()) {
    CUTOFF_MS = runtime.getKeepStaleDataMs()
  }

  const updateSource = useCallback(
    ({ name, type }) => {
      if (!source || type !== source.type || name !== source.name) {
        setSource({ name, type })
      }
    },
    [source, setSource]
  )

  const updateData = useCallback(
    ({ states = [], events = [], runtime }) => {
      if (states.length)
        dispatchStates({
          action: 'append',
          data: states,
        })
      if (events.length)
        dispatchEvents({
          action: 'append',
          data: events,
        })
      if (runtime) setRuntime(runtime)
    },
    [dispatchStates, dispatchEvents, setRuntime]
  )

  const replaceData = useCallback(
    ({ states = [], events = [], runtime }) => {
      dispatchStates({
        action: states.length ? 'replace' : 'remove',
        data: states,
      })
      dispatchEvents({
        action: events.length ? 'replace' : 'remove',
        data: events,
      })
      setRuntime(runtime)
    },
    [dispatchStates, dispatchEvents, setRuntime]
  )

  const removeData = useCallback(() => {
    dispatchStates({ action: 'remove' })
    dispatchEvents({ action: 'remove' })
    setRuntime(undefined)
  }, [dispatchStates, dispatchEvents, setRuntime])

  return {
    states,
    events,
    runtime,
    peerIds,
    source,
    updateSource,
    updateData,
    replaceData,
    removeData,
    setPeerIds,
    setRuntime,
  }
}

export default useDatastore
