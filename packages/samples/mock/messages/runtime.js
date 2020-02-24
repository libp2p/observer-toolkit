'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

const { HOST_PEER_ID } = require('../utils')

function createRuntime() {
  return new Runtime([
    'go-libp2p', // Implementation
    '2', // Version
    'macOS', // Platform
    HOST_PEER_ID, // Introspecting user's own peer ID
  ])
}

module.exports = {
  createRuntime,
}
