import { useCallback, useReducer, useRef, useState } from 'react'

let CUTOFF_MS = 60000
let PRESUMED_STATE_LENGTH = 2000

function getStartTs(msg) {
  if (msg.getTs) return msg.getTs()

  msg.getStartTs()
    ? msg.getStartTs()
    : msg.getInstantTs() - PRESUMED_STATE_LENGTH
}

function updateStoredData(data) {
  let latestTs = data
    .map(msg => getStartTs(msg))
    .sort()
    .pop()
  return data
    .filter(msg => {
      if (latestTs - getStartTs(msg) > CUTOFF_MS) return false
      return true
    })
    .map(msg => {
      if (!msg.getSubsystems) return msg
      const stateTs = getStartTs(msg)
      const subsystems = msg.getSubsystems()
      const connections = subsystems.getConnectionsList()
      const cns = connections.filter(cn => {
        if (!cn.getTimeline().getCloseTs()) {
          return true
        }
        const closeTs = cn.getTimeline().getCloseTs()
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
      throw new Error(`Action "${action}" not valid in handleDispatchData`)
  }
}

function handleDispatchSource(oldSource, { action, source }) {
  switch (action) {
    case 'update':
      return Object.assign({}, oldSource, source)
    case 'setIsLoading':
      return { ...oldSource, isLoading: source.isLoading }
    case 'remove':
      return getEmptySource()
    default:
      throw new Error(`Action "${action}" not valid in handleDispatchSource`)
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

function getEmptySource() {
  return {
    name: null,
    type: null,
    isLoading: false,
  }
}

function useDatastore({
  initialRuntime,
  initialStates = [],
  initialEvents = [],
  initialSource = getEmptySource(),
}) {
  const [states, dispatchStates] = useReducer(handleDispatchData, initialStates)
  const [events, dispatchEvents] = useReducer(handleDispatchData, initialEvents)
  const [source, dispatchSource] = useReducer(
    handleDispatchSource,
    initialSource
  )
  const [websocket, setWebsocket] = useState(null)
  const [runtime, setRuntime] = useState(initialRuntime)
  const [peerIds, setPeerIds] = useState([])

  if (runtime && runtime.getKeepStaleDataMs()) {
    CUTOFF_MS = runtime.getKeepStaleDataMs()
  }
  if (runtime && runtime.getSendStateIntervalMs()) {
    PRESUMED_STATE_LENGTH = runtime.getSendStateIntervalMs()
  }

  const setIsLoading = useCallback(
    isLoading =>
      dispatchSource({ action: 'setIsLoading', source: { isLoading } }),
    [dispatchSource]
  )

  // Access current websocket state inside ref-cached callbacks
  const websocketRef = useRef()
  websocketRef.current = websocket

  const closeWebsocket = useCallback(
    (reason, statusCode = 1000) => {
      if (websocketRef.current) {
        websocketRef.current.close(statusCode, reason)
        setWebsocket(null)
      }
    },
    [websocketRef, setWebsocket]
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
    ({ states = [], events = [], runtime, source }) => {
      closeWebsocket('Connection replaced by user')

      dispatchStates({
        action: states.length ? 'replace' : 'remove',
        data: states,
      })
      dispatchEvents({
        action: events.length ? 'replace' : 'remove',
        data: events,
      })
      source &&
        dispatchSource({
          action: 'update',
          source,
        })
      setRuntime(runtime)
    },
    [closeWebsocket]
  )

  const removeData = useCallback(
    source => {
      closeWebsocket('Connection removed by user')
      dispatchEvents({ action: 'remove' })
      dispatchStates({ action: 'remove' })
      setRuntime(undefined)

      dispatchSource({ action: source ? 'update' : 'remove', source })
    },
    [closeWebsocket]
  )

  return {
    states,
    events,
    runtime,
    peerIds,
    source,
    setIsLoading,
    updateData,
    replaceData,
    removeData,
    setPeerIds,
    setRuntime,
    setWebsocket,
  }
}

export default useDatastore
