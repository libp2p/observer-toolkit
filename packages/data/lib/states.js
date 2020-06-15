'use strict'
// Convenience functions for extracting non-subsystem-specific data from protobuf states

function getSubsystems(state) {
  if (!state) return null
  return state.getSubsystems()
}

function getLatestState(states) {
  if (!states.length) return null
  return states[states.length - 1]
}

const emptyTimes = {
  start: 0,
  end: 0,
  duration: 0,
}

function getStateTime(state) {
  if (!state) return null
  const ts = state.getInstantTs()
  return ts
}

function getPreviousStateTime(timeIndex, states) {
  if (!states.length) return 0
  if (states.length === 1) return getStateTime(states[0])
  if (timeIndex > 0) return getStateTime(states[timeIndex - 1])

  // If there's no previous time, start at one state interval before the first
  const nextTime = getStateTime(states[timeIndex + 1])
  const currentTime = getStateTime(states[timeIndex])
  const firstStateInterval = nextTime - currentTime
  return currentTime - firstStateInterval
}

function getStateRangeTimes(states) {
  if (!states || !states.length) return emptyTimes

  const start = getPreviousStateTime(0, states)
  const end = states[states.length - 1].getInstantTs()
  const duration = end - start
  return {
    start,
    end,
    duration,
  }
}

function getStateIndex(states, timestamp) {
  return states.findIndex(state => getStateTime(state) === timestamp)
}

module.exports = {
  getLatestState,
  getSubsystems,
  getStateRangeTimes,
  getStateTime,
  getPreviousStateTime,
  getStateIndex,
}
