'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

const { DEFAULT_SNAPSHOT_DURATION, HOST_PEER_ID } = require('../utils')

function createRuntime({
  peerId = HOST_PEER_ID,
  stateIntervalDuration = DEFAULT_SNAPSHOT_DURATION,
} = {}) {
  const runtime = new Runtime([
    'go-libp2p', // Implementation
    '2', // Version
    'macOS', // Platform
    peerId, // Introspecting user's own peer ID
  ])
  runtime.setSendStateIntervalMs(stateIntervalDuration)
  return runtime
}

module.exports = {
  createRuntime,
}
