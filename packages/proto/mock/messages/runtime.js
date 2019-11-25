'use strict'

const {
  Runtime,
} = require('../../protobuf/introspection_pb')

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
