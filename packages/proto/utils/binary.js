const { State } = require('../protobuf/introspection_pb')

function parseBuffer(buf) {
  // Expects a binary file with this repeating structure:
  // - 4-byte version number
  // - 4-byte length of following State message
  // - State message

  const byteLength = Buffer.byteLength(buf)

  let bytesParsed = 0
  const messages = []

  const versionNumberLength = 4
  const stateMessageSizeLength = 4

  // TODO - add async variant
  while (bytesParsed < byteLength) {
    // Skip version number
    bytesParsed += versionNumberLength

    const stateMessageSize = buf.readUIntLE(bytesParsed, stateMessageSizeLength)
    const stateMessageStart = bytesParsed + stateMessageSizeLength
    const stateMessageEnd = stateMessageStart + stateMessageSize
    const stateMessageBin = buf.toString(
      'base64',
      stateMessageStart,
      stateMessageEnd
    )

    const stateMessage = State.deserializeBinary(stateMessageBin)

    messages.push(stateMessage)
    bytesParsed = stateMessageEnd
  }

  return messages
}

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
  parseBuffer,
}
