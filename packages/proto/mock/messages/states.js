'use strict'

const {
  State,
  Subsystems,
} = require('../../protobuf/introspection_pb')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')

const { SNAPSHOT_DURATION } = require('../utils')
const { createTraffic, sumTraffic } = require('../messages/traffic')

function createState(connectionsList, now) {
  const state = new State()

  state.setInstantTs(new Timestamp([now]))
  state.setStartTs(new Timestamp([now - SNAPSHOT_DURATION + 1]))
  state.setSnapshotDurationMs(SNAPSHOT_DURATION)

  const stateTraffic = createTraffic()
  state.setTraffic(stateTraffic)
  sumTraffic(stateTraffic, connectionsList)

  const subsystems = new Subsystems()

  subsystems.setConnectionsList(connectionsList)
  state.setSubsystems(subsystems)

  return state
}

module.exports = {
  createState,
}
