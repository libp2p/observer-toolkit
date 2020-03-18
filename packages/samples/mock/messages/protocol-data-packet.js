'use strict'

const {
  proto: { ProtocolDataPacket, Version },
} = require('@libp2p-observer/proto')

function createProtocolDataPacket(message, type) {
  const dataPacket = new ProtocolDataPacket()

  dataPacket.setVersion(new Version(1))

  if (type === 'runtime') {
    dataPacket.setRuntime(message)
  } else if (type === 'event') {
    dataPacket.setEvent(message)
  } else if (type === 'state') {
    dataPacket.setState(message)
  } else {
    throw new Error(`Unrecognised packet type "${type}"`)
  }

  return dataPacket
}

function createProtocolEventPacket(message) {
  return createProtocolDataPacket(message, 'event')
}

function createProtocolRuntimePacket(message) {
  return createProtocolDataPacket(message, 'runtime')
}

function createProtocolStatePacket(message) {
  return createProtocolDataPacket(message, 'state')
}

module.exports = {
  createProtocolDataPacket,
  createProtocolEventPacket,
  createProtocolRuntimePacket,
  createProtocolStatePacket,
}
