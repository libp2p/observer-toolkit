'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

const { generateHashId } = require('../utils')

function createRuntime() {
  const peerId = generateHashId()

  return new Runtime([
    'go-libp2p', // Implementation
    '2', // Version
    'macOS', // Platform
    peerId, // Introspecting user's own peer ID
  ])
}

module.exports = {
  createRuntime,
}
