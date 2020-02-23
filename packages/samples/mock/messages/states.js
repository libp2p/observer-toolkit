'use strict'

const {
  proto: { State, Subsystems },
} = require('@libp2p-observer/proto')

const { SNAPSHOT_DURATION, createTimestamp } = require('../utils')
const { createTraffic, sumTraffic } = require('../messages/traffic')

function createState(connectionsList, now, dht) {
  const state = new State()

  state.setInstantTs(createTimestamp(now))
  state.setStartTs(createTimestamp(now))
  state.setSnapshotDurationMs(SNAPSHOT_DURATION)

  const stateTraffic = createTraffic()
  state.setTraffic(stateTraffic)
  sumTraffic(stateTraffic, connectionsList)

  const subsystems = new Subsystems()
  subsystems.setConnectionsList(connectionsList)
  subsystems.setDht(dht)
  state.setSubsystems(subsystems)

  return state
}

module.exports = {
  createState,
}
