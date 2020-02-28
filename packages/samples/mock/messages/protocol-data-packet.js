'use strict'

const {
  proto: { ProtocolDataPacket, Version },
} = require('@libp2p-observer/proto')

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
