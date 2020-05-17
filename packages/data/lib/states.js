'use strict'
// Convenience functions for extracting non-subsystem-specific data from protobuf states

function getSubsystems(state) {
  if (!state) return null
  return state.getSubsystems()
}

// TODO: deprecate or rename this
function getTime(state) {
  if (!state) return null
  return state.getInstantTs()
}

// TODO: rename 'timepoints' to 'states' everywhere
function getLatestTimepoint(timepoints) {
  if (!timepoints.length) return null
  return timepoints[timepoints.length - 1]
}

function getStateTimes(state) {
  if (!state) return null

  const end = getTime(state)
  const duration = state.getSnapshotDurationMs()
  const start = state.getStartTs()
  return {
    // Can't rely on introspection sending complete data
    // Try to fill in any gaps with whatever we have
    start: start || end - duration || 0,
    end: end || start + duration || 0,
    duration: duration || end - start || 0,
  }
}

function getStateRangeTimes(states) {
  if (!states || !states.length) {
    return {
      start: 0,
      end: 0,
      duration: 0,
    }
  }

  const start = states[0].getStartTs()
  const end = states[states.length - 1].getInstantTs()
  const duration = end - start
  return {
    start,
    end,
    duration,
  }
}

function getTimeIndex(states, timestamp) {
  return states.findIndex(state => getTime(state) === timestamp)
}

module.exports = {
  getLatestTimepoint,
  getSubsystems,
  getStateRangeTimes,
  getStateTimes,
  getTime,
  getTimeIndex,
}
