'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

const { DEFAULT_SNAPSHOT_DURATION, HOST_PEER_ID, generateHashId } = require('../utils')

function createRuntime({ stateIntervalDuration = DEFAULT_SNAPSHOT_DURATION } = {}) {
  const peerId = generateHashId()
  const runtime = new Runtime([
    'go-libp2p', // Implementation
    '2', // Version
    'macOS', // Platform
    HOST_PEER_ID, // Introspecting user's own peer ID
  ])
  runtime.setSendStateIntervalMs(stateIntervalDuration)
  return runtime
}

module.exports = {
  createRuntime,
}
