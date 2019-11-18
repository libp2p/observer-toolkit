'use strict'

const { deserializeBinary } = require('@libp2p-observer/proto')

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

    const stateMessage = deserializeBinary(stateMessageBin)

    messages.push(stateMessage)
    bytesParsed = stateMessageEnd
  }

  return messages
}

function parseArrayBuffer(arrayBuf) {
  return parseBuffer(Buffer.from(arrayBuf))
}

function parseBase64(dataString) {
  return parseBuffer(Buffer.from(dataString, 'base64'))
}

function parseImport(rawData) {
  if (rawData instanceof Buffer) return parseBuffer(rawData)
  if (rawData instanceof ArrayBuffer) return parseArrayBuffer(rawData)
  if (rawData instanceof String) return parseBase64(rawData)
}

module.exports = {
  parseArrayBuffer,
  parseBase64,
  parseBuffer,
  parseImport,
}
