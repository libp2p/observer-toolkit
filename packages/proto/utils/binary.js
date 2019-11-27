'use strict'

const { State } = require('../protobuf/introspection_pb')
const fnv1a = require('./fnv1a')

function parseBuffer(buf) {
  // Expects a binary file with this structure:
  // - 4-byte version number
  // - The following is repeated
  // - 4-byte checksum of following message
  // - 4-byte length of following message
  // - message (typically state)

  const byteLength = Buffer.byteLength(buf)

  let bytesParsed = 0
  const messages = []

  const versionNumberLength = 4
  const messageChecksumLength = 4
  const messageSizeLength = 4


  // Skip version number
  bytesParsed += versionNumberLength

  // TODO - add async variant
  while (bytesParsed < byteLength) {
    const messageChecksum = buf.readUIntLE(bytesParsed, messageChecksumLength)
    bytesParsed += messageChecksumLength
    const messageSize = buf.readUIntLE(bytesParsed, messageSizeLength)
    const messageStart = bytesParsed + messageSizeLength
    const messageEnd = messageStart + messageSize

    const messageBin = buf.slice(messageStart, messageEnd)

    const validChecksum = messageChecksum === fnv1a(messageBin)

    // TODO: bubble an error message for an invalid checksum
    if (validChecksum) {
      const message = State.deserializeBinary(messageBin)
      messages.push(message)
    }
    bytesParsed = messageEnd
  }

  return messages
}

function createBufferSegment(msg) {
  const { buffer, byteLength } = msg.serializeBinary()
  const checksum = fnv1a(buffer)

  // Mimics the output format of go-libp2p-introspection's ws writer.
  // First is a 4-byte LE integer that is a checksum for the following buffer
  // Then a 4-byte LE integer stating the byte length of a msg / timebar position.
  const metaBuffer = Buffer.alloc(8)
  metaBuffer.writeUIntLE(checksum, 0, 4)
  metaBuffer.writeUIntLE(byteLength, 4, 4)

  const contentBuffer = Buffer.from(buffer)
  return Buffer.concat([metaBuffer, contentBuffer])
}

module.exports = {
  createBufferSegment,
  parseBuffer,
}
