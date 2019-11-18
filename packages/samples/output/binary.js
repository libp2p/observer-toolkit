'use strict'

function createBufferSegment(state, version) {
  const { buffer, byteLength } = state.serializeBinary()

  // Mimics the output format of go-libp2p-introspection's ws writer.
  // First 4 bytes is an unused version number that may be skipped for now.
  // Then a 4-byte LE integer stating the byte length of a state / timebar position.
  const lengthBuffer = Buffer.alloc(8)
  lengthBuffer.writeUIntLE(byteLength, 4, 4)

  const contentBuffer = Buffer.from(buffer)
  return Buffer.concat([lengthBuffer, contentBuffer])
}

module.exports = {
  createBufferSegment,
}
