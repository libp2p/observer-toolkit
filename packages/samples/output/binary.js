'use strict'

const { fnv1a } = require('@libp2p/observer-proto')

function createBufferSegment(packet, version) {
  const { buffer, byteLength } = packet.serializeBinary()
  const contentBuffer = Buffer.from(buffer)
  const checksum = fnv1a(contentBuffer)

  // Mimics the output format of go-libp2p-introspection's ws writer.
  // First is a 4-byte LE integer that is a checksum for the following buffer
  // Then a 4-byte LE integer stating the byte length of a state / timebar position.
  const metaBuffer = Buffer.alloc(8)
  metaBuffer.writeUIntLE(checksum, 0, 4)
  metaBuffer.writeUIntLE(byteLength, 4, 4)

  return Buffer.concat([metaBuffer, contentBuffer])
}

module.exports = {
  createBufferSegment,
}
