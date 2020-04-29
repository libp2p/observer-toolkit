import { useCallback, useReducer, useState } from 'react'

let CUTOFF_MS = 60000
let PRESUMED_STATE_LENGTH = 2000

function getStartTs(msg) {
  if (msg.getTs) return msg.getTs()

  return msg.getStartTs()
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

function handleDispatchWebsocket(oldWsData, { action, ...args }) {
  switch (action) {
    case 'onOpen':
      return onWebsocketOpen(args)
    case 'onData':
      return onWebsocketData(oldWsData, args)
    case 'onPauseChange':
      return onWebsocketPauseChange(oldWsData, args)
    case 'close':
      if (oldWsData) closeWebsocket(oldWsData.ws, args)
    // fall through
    case 'onClose':
      return null
    default:
      throw new Error(`Action "${action}" not valid in handleDispatchWebsocket`)
  }
}

function onWebsocketOpen({ ws, sendSignal }) {
  return {
    ws,
    sendSignal,
    isPaused: false,
    hasData: false,
  }
}

function onWebsocketData(oldWsData, { callback }) {
  if (!oldWsData || oldWsData.hasData) return oldWsData
  if (callback) callback()
  return {
    ...oldWsData,
    hasData: true,
  }
}

function closeWebsocket(ws, { reason, statusCode = 1000 }) {
  ws.close(statusCode, reason)
}

function onWebsocketPauseChange(oldWsData, { isPaused }) {
  // No error if connection closed between pause signal being sent and recieved
  if (!oldWsData) return null

  return {
    ...oldWsData,
    isPaused,
  }
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
  const [websocket, dispatchWebsocket] = useReducer(
    handleDispatchWebsocket,
    null
  )
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
    [dispatchEvents, dispatchStates, setRuntime]
  )

  const replaceData = useCallback(
    ({ states = [], events = [], runtime, source }) => {
      dispatchStates({
        action: states.length ? 'replace' : 'remove',
        data: states,
      })
      dispatchEvents({
        action: events.length ? 'replace' : 'remove',
        data: events,
      })
      setRuntime(runtime)

      dispatchWebsocket({
        action: 'close',
        reason: 'Connection replaced by user',
      })
      source &&
        dispatchSource({
          action: 'update',
          source,
        })
    },
    [
      dispatchEvents,
      dispatchStates,
      dispatchSource,
      dispatchWebsocket,
      setRuntime,
    ]
  )

  const removeData = useCallback(
    source => {
      dispatchEvents({ action: 'remove' })
      dispatchStates({ action: 'remove' })
      setRuntime(undefined)

      dispatchWebsocket({
        action: 'close',
        reason: 'Connection removed by user',
      })
      dispatchSource({ action: source ? 'update' : 'remove', source })
    },
    [
      dispatchEvents,
      dispatchStates,
      dispatchSource,
      dispatchWebsocket,
      setRuntime,
    ]
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
    websocket,
    dispatchWebsocket,
  }
}

export default useDatastore
