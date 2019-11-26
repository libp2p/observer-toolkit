'use strict'

const {
  proto: { ProtocolDataPacket, Version },
  fnv1a,
} = require('@libp2p-observer/proto')

function createPacket(state) {
  const packet = new ProtocolDataPacket()
  const version = new Version(1)

  packet.setVersion(version)
  packet.setState(state)

  return packet
}

function createBufferSegment(state, version) {
  const packet = createPacket(state)

  const { buffer, byteLength } = packet.serializeBinary()
  const checksum = fnv1a(Buffer.from(buffer))

  // Mimics the output format of go-libp2p-introspection's ws writer.
  // First is a 4-byte LE integer that is a checksum for the following buffer
  // Then a 4-byte LE integer stating the byte length of a state / timebar position.
  const metaBuffer = Buffer.alloc(8)
  metaBuffer.writeUIntLE(checksum, 0, 4)
  metaBuffer.writeUIntLE(byteLength, 4, 4)

  const contentBuffer = Buffer.from(buffer)
  return Buffer.concat([metaBuffer, contentBuffer])
}

module.exports = {
  createBufferSegment,
}
