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
  const start = end - duration
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
  getStateTimes,
  getTime,
  getTimeIndex,
}
