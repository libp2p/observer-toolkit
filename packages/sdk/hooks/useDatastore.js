import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import T from 'prop-types'

import { getStateTimes } from '@libp2p/observer-data'

// High default cutoff time to avoid spurious trimming if runtime message is delayed
const DEFAULT_CUTOFF_MS = 1000 * 60 * 60 * 24

function getEventTime(event) {
  return event.getTs()
}
function getStateEnd(state) {
  return getStateTimes(state).end
}
function getMessageSorter(getTime) {
  return (a, b) => getTime(a) - getTime(b)
}
const sortStates = getMessageSorter(getStateEnd)
const sortEvents = getMessageSorter(getEventTime)

// To access metadata inside useReducer dispatcher, it must be attached to the hook data
function attachCutoff(messages, cutoff, cutoffKey) {
  if (typeof cutoff !== 'number' || isNaN(cutoff)) {
    throw new Error(
      `${cutoffKey ||
        'Undefined cutoff type'} ${cutoff} (${typeof cutoff}) is not a number`
    )
  }
  if (cutoff === messages[cutoffKey]) return messages

  messages[cutoffKey] = cutoff
  return messages
}
const attachStatesCutoff = (states, cutoffMs) =>
  attachCutoff(states, cutoffMs, 'cutoffMs')

const attachEventsMetadata = (events, cutoffTime) => {
  const eventsWithCutoff = attachCutoff(events, cutoffTime, 'cutoffTime')

  // Find any new events that included new event type metadata and expose in prop
  const newEventTypes = events.reduce((eventTypes, event) => {
    const eventType = event.getType()
    const propertyList = eventType && eventType.getPropertyTypesList()
    const hasProperties = propertyList && propertyList.length
    if (!hasProperties) return eventTypes
    return [...eventTypes, eventType]
  }, events.newEventTypes || [])
  eventsWithCutoff.newEventTypes = newEventTypes

  return eventsWithCutoff
}

function getEmptyEvents(cutoffTime = 0) {
  const events = []
  events.cutoffTime = cutoffTime
  return events
}

function getEmptyStates(cutoffMs = DEFAULT_CUTOFF_MS) {
  const states = []
  states.cutoffMs = cutoffMs
  return states
}

function getCutoffTime(states, cutoffMs) {
  if (!states.length) return 0
  const lastStateTs = getStateTimes(states[states.length - 1]).end
  return lastStateTs - cutoffMs
}

function updateCutoffRef(cutoffRef, config) {
  const newCutoffMs = config
    ? config.getRetentionPeriodMs() || DEFAULT_CUTOFF_MS
    : DEFAULT_CUTOFF_MS

  if (cutoffRef.current === newCutoffMs) return null
  cutoffRef.current = newCutoffMs
  return newCutoffMs
}

function trimStaleMessages(messages, cutoffTime, getTime) {
  if (!messages.length) return messages
  const firstMessageTs = getTime(messages[0])

  if (firstMessageTs >= cutoffTime) return messages

  const trimmedMessages = messages.slice(
    messages.findIndex(message => getTime(message) >= cutoffTime)
  )
  return trimmedMessages
}

function insertMessages(messages, oldMessages, getTime) {
  if (!messages.length) return messages
  const sortMessages = getMessageSorter(getTime)
  const sortedNewMessages = [...messages.sort(sortMessages)]
  const joinedMessages = [...oldMessages, ...sortedNewMessages]
  if (!oldMessages.length) return joinedMessages

  // If any new messages come before last old message, fix sort order
  const firsSortedNewTs = getTime(sortedNewMessages[0])
  const lastOldTs = getTime(oldMessages[oldMessages.length - 1])
  if (firsSortedNewTs < lastOldTs) {
    joinedMessages.sort(sortMessages)
  }
  return joinedMessages
}

function appendStates(newStates, oldStates, cutoffMs) {
  const joinedStates = insertMessages(newStates, oldStates, getStateEnd)
  const cutoffTime = getCutoffTime(joinedStates, cutoffMs)
  return trimStaleMessages(joinedStates, cutoffTime, getStateEnd)
}

function replaceStates(states, cutoffMs) {
  const sortedStates = [...states].sort(sortStates)
  const cutoffTime = getCutoffTime(sortedStates, cutoffMs)
  const trimmedStates = trimStaleMessages(sortedStates, cutoffTime, getStateEnd)
  return trimmedStates
}

function appendEvents(newEvents, oldEvents, cutoffTime = 0) {
  const joinedEvents = insertMessages(newEvents, oldEvents, getEventTime)
  const trimmedEvents = trimStaleMessages(
    joinedEvents,
    cutoffTime,
    getEventTime
  )
  return trimmedEvents
}

function replaceEvents(events) {
  return [...events].sort(sortEvents)
}

function handleDispatchStates(oldData, { action, data, cutoffMs }) {
  switch (action) {
    case 'append':
      return attachStatesCutoff(appendStates(data, oldData, cutoffMs), cutoffMs)
    case 'replace':
      return attachStatesCutoff(replaceStates(data, cutoffMs), cutoffMs)
    case 'setCutoff':
      return attachStatesCutoff(
        trimStaleMessages(
          oldData,
          getCutoffTime(oldData, cutoffMs),
          getStateEnd
        ),
        cutoffMs
      )
    case 'remove':
      return getEmptyStates()
    default:
      throw new Error(`Action "${action}" not valid in handleDispatchData`)
  }
}

function handleDispatchEvents(oldData, { action, data, cutoffTime }) {
  switch (action) {
    case 'append':
      return attachEventsMetadata(
        appendEvents(data, oldData, oldData.cutoffTime),
        oldData.cutoffTime
      )
    case 'replace':
      return attachEventsMetadata(
        replaceEvents(data),
        0 // Replaced events cutoff will be applied in useEffect after states resolve
      )
    case 'setCutoff':
      return cutoffTime !== oldData.cutoffTime
        ? attachEventsMetadata(
            cutoffTime
              ? trimStaleMessages(oldData, cutoffTime, getEventTime)
              : oldData,
            cutoffTime
          )
        : oldData
    case 'remove':
      return getEmptyEvents()
    default:
      throw new Error(`Action "${action}" not valid in handleDispatchData`)
  }
}

function handleDispatchSource(oldSource, { action, source }) {
  switch (action) {
    case 'update':
      return Object.assign({}, oldSource, source)
    case 'setIsLoading':
      if (oldSource.isLoading === source.isLoading) return oldSource
      return { ...oldSource, isLoading: source.isLoading }
    case 'remove':
      return getEmptySource()
    default:
      throw new Error(`Action "${action}" not valid in handleDispatchSource`)
  }
}

function handleDispatchWebsocket(oldWsData, { action, ...args }) {
  // No-op for non-open actions when there's no open websocket
  if (!oldWsData && action !== 'onOpen') return oldWsData

  switch (action) {
    case 'onOpen':
      return onWebsocketOpen(args)
    case 'onData':
      return onWebsocketData(oldWsData, args)
    case 'onPauseChange':
      return onWebsocketPauseChange(oldWsData, args)
    case 'attachCallback':
      return attachWebsocketCallback(oldWsData, args)
    case 'runCallback':
      return runWebsocketCallback(oldWsData, args)
    case 'close':
      if (oldWsData) closeWebsocket(oldWsData.ws, args)
    // fall through
    case 'onClose':
      return null
    default:
      throw new Error(`Action "${action}" not valid in handleDispatchWebsocket`)
  }
}

function onWebsocketOpen({ ws, sendCommand }) {
  return {
    ws,
    sendCommand,
    isPaused: false,
    hasData: false,
    callbacksByCommandId: new Map(),
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

function attachWebsocketCallback(oldWsData, { commandId, callback }) {
  oldWsData.callbacksByCommandId.set(commandId, callback)
  return { ...oldWsData }
}

function runWebsocketCallback(oldWsData, { commandId }) {
  if (!oldWsData.callbacksByCommandId.has(commandId)) return oldWsData

  oldWsData.callbacksByCommandId.get(commandId)()
  oldWsData.callbacksByCommandId.delete(commandId)
  return { ...oldWsData }
}

function getEmptySource() {
  return {
    name: null,
    type: null,
    isLoading: false,
  }
}

function getConfigFromResponses(responses) {
  if (!responses || !responses.length) return null

  const config = responses.reduce((latestConfig, response) => {
    // Get config from latest response that has one
    const responseConfig = response.getEffectiveConfig()
    if (!responseConfig) return latestConfig
    return responseConfig
  }, null)

  return config || null
}

function useDatastore(props) {
  T.checkPropTypes(useDatastore.propTypes, props, 'prop', 'useDatastore')
  const {
    initialRuntime = null,
    initialConfig = null,
    initialStates = getEmptyStates(),
    initialEvents = getEmptyEvents(),
    initialSource = getEmptySource(),
  } = props

  const [runtime, setRuntime] = useState(initialRuntime)

  const cutoffRef = useRef(DEFAULT_CUTOFF_MS)
  const [config, setConfig] = useState(initialConfig)
  updateCutoffRef(cutoffRef, config)

  const [states, dispatchStates] = useReducer(
    handleDispatchStates,
    initialStates,
    initStates => {
      const cutoffMs = cutoffRef.current
      return attachStatesCutoff(replaceStates(initStates, cutoffMs), cutoffMs)
    }
  )

  const [events, dispatchEvents] = useReducer(
    handleDispatchEvents,
    initialEvents,
    initEvents => {
      const cutoffTime = getCutoffTime(states, cutoffRef.current)
      return attachEventsMetadata(
        appendEvents(initEvents, [], cutoffTime),
        cutoffTime
      )
    }
  )
  const [source, dispatchSource] = useReducer(
    handleDispatchSource,
    initialSource
  )
  const [websocket, dispatchWebsocket] = useReducer(
    handleDispatchWebsocket,
    null
  )
  const [peerIds, setPeerIds] = useState([])

  const setIsLoading = useCallback(
    isLoading =>
      dispatchSource({ action: 'setIsLoading', source: { isLoading } }),
    [dispatchSource]
  )

  const updateRuntime = useCallback(
    // This currently just wraps `setRuntime`
    // but may need event type validation in future
    runtime => setRuntime(runtime),
    [setRuntime]
  )

  const updateConfig = useCallback(
    config => {
      if (!config) {
        // Pass in null not an array to remove config
        setConfig(null)
        cutoffRef.current = DEFAULT_CUTOFF_MS
        return null
      }

      const newCutoffMs = updateCutoffRef(cutoffRef, config)
      setConfig(config)
      if (newCutoffMs) {
        dispatchStates({
          action: 'setCutoff',
          cutoffMs: newCutoffMs,
        })
        // Events cutoff will be updated by useEffect using updated states
      }
      return config
    },
    [cutoffRef, setConfig]
  )

  const updateData = useCallback(
    ({
      states: newStates = [],
      events: newEvents = [],
      runtime: newRuntime,
      responses: newResponses = [],
      config: newConfig,
    }) => {
      if (newRuntime) updateRuntime(newRuntime)

      newResponses.forEach(response => {
        const isError = !!response.getError()
        if (!isError)
          dispatchWebsocket({
            action: 'runCallback',
            commandId: response.getId(),
          })
      })

      const updatedConfig = newConfig || getConfigFromResponses(newResponses)
      if (updatedConfig) updateConfig(updatedConfig)

      if (newStates.length) {
        dispatchStates({
          action: 'append',
          data: newStates,
          cutoffMs: cutoffRef.current,
        })
      }

      if (newEvents.length) {
        dispatchEvents({
          action: 'append',
          data: newEvents,
        })
      }
    },
    [updateRuntime, updateConfig, dispatchEvents, dispatchStates, cutoffRef]
  )

  const replaceData = useCallback(
    ({
      states: newStates = [],
      events: newEvents = [],
      runtime: newRuntime,
      responses: newResponses,
      config = null,
      source: newSource,
    }) => {
      updateRuntime(newRuntime || null)
      const newConfig = updateConfig(
        config || getConfigFromResponses(newResponses)
      )

      dispatchStates({
        action: newStates.length ? 'replace' : 'remove',
        data: newStates,
        cutoffMs: newConfig
          ? newConfig.getRetentionPeriodMs()
          : DEFAULT_CUTOFF_MS,
      })
      dispatchEvents({
        action: newEvents.length ? 'replace' : 'remove',
        data: newEvents,
      })
      dispatchWebsocket({
        action: 'close',
        reason: 'Connection replaced by user',
      })
      newSource &&
        dispatchSource({
          action: 'update',
          source: newSource,
        })
    },
    [updateConfig, updateRuntime]
  )

  const removeData = useCallback(
    source => {
      dispatchEvents({ action: 'remove' })
      dispatchStates({ action: 'remove' })
      updateRuntime(null)
      updateConfig(null)

      dispatchWebsocket({
        action: 'close',
        reason: 'Connection removed by user',
      })
      dispatchSource({ action: source ? 'update' : 'remove', source })
    },
    [updateConfig, updateRuntime]
  )

  const cutoffMs = cutoffRef.current
  const newEventTypes = useMemo(() => events.newEventTypes, [
    events.newEventTypes,
  ])

  useEffect(() => {
    // Update our stored runtime with any new event types shared inside events
    if (runtime && newEventTypes) {
      const eventTypesToAdd = newEventTypes.filter(eventType => {
        const knownEventTypes = runtime.getEventTypesList()
        const eventTypeIsKnown = knownEventTypes.some(
          knownType => knownType.getName() === eventType.getName()
        )
        return !eventTypeIsKnown
      })
      if (eventTypesToAdd.length) {
        const newRuntime = runtime.clone()
        eventTypesToAdd.forEach(eventType => {
          newRuntime.addEventTypes(eventType)
        })
        updateRuntime(newRuntime)
      }
    }

    // Updating events cutoff time must be done after state updates have applied
    const cutoffTime = getCutoffTime(states, cutoffMs)
    // Check if cutoff time has changed in dispatch handler, so `events` isn't
    // needed as useEffect dep, so this effect doesn't run on every new event
    dispatchEvents({
      action: 'setCutoff',
      cutoffTime,
    })
  }, [dispatchEvents, states, cutoffMs, newEventTypes, runtime, updateRuntime])

  return {
    states,
    events,
    runtime,
    config,
    peerIds,
    source,
    setIsLoading,
    updateData,
    replaceData,
    removeData,
    setPeerIds,
    updateRuntime,
    updateConfig,
    websocket,
    dispatchWebsocket,
  }
}
useDatastore.propTypes = {
  initialRuntime: T.object,
  initialStates: T.array,
  initialEvents: T.array,
  initialSource: T.object,
}

export default useDatastore
