'use strict'

const {
  Version,
  ProtocolDataPacket
} = require('../../protobuf/introspection_pb')

function createProtocolDataPacket(message, isRuntime = false) {
  const dataPacket = new ProtocolDataPacket()

  dataPacket.setVersion(new Version(1))

  if (isRuntime) {
    dataPacket.setRuntime(message)
  } else {
    dataPacket.setState(message)
  }

  return dataPacket
}

module.exports = {
  createProtocolDataPacket,
}
