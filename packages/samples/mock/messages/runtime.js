'use strict'

const {
  proto: { Runtime },
} = require('@libp2p-observer/proto')

function createRuntime() {
  return new Runtime([
    'go-libp2p', // Implementation
    '2', // Version
    'macOS', // Platform
  ])
}

module.exports = {
  createRuntime,
}
