'use strict'

const {
  proto: { State, Subsystems },
} = require('@nearform/observer-proto')

const { createTimestamp } = require('../utils')
const { createTraffic, sumTraffic } = require('../messages/traffic')

function createState(connectionsList, now, dht, duration) {
  const state = new State()

  state.setInstantTs(createTimestamp(now))
  state.setStartTs(createTimestamp(now - duration + 1))
  state.setSnapshotDurationMs(duration)

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
