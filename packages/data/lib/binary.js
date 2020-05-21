'use strict'

const { deserializeBinary, fnv1a } = require('@nearform/observer-proto')

const getEmptyMessages = () => ({
  states: [],
  events: [],
  runtime: null,
})

function getMessageChecksum(buffer) {
  return fnv1a(buffer)
}

function parseBuffer(buf) {
  // Expects a binary file with this structure:
  // - 4-byte version number
  // - The following is repeated
  // - 4-byte checksum of following message
  // - 4-byte length of following message
  // - message (typically state)

  const byteLength = Buffer.byteLength(buf)

  let bytesParsed = 0
  const messages = getEmptyMessages()

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

    const validChecksum = getMessageChecksum(messageBin) === messageChecksum

    // TODO: bubble an error message for an invalid checksum
    if (validChecksum) {
      addMessageContent(messageBin, messages)
    } else {
      console.error(
        `Skipped bytes from ${messageStart} to ${messageEnd} due to checksum mismatch`
      )
    }

    bytesParsed = messageEnd
  }

  return messages
}

function addMessage(message, messages) {
  const runtimeContent = message.getRuntime()
  const stateContent = message.getState()
  const eventContent = message.getEvent()

  if (stateContent) {
    messages.states.push(stateContent)
  }
  if (eventContent) {
    messages.events.push(eventContent)
  }
  if (runtimeContent) {
    // By current proto def, runtime data can't reasonably change during a session, so,
    // Runtime has no timestamp. If this changes, make `runtime` an array and push here.
    messages.runtime = runtimeContent
  }
}

function addMessageContent(messageBin, messages) {
  const message = deserializeBinary(messageBin)
  addMessage(message, messages)
}

function parseArrayBuffer(arrayBuf) {
  return parseBuffer(Buffer.from(arrayBuf))
}

function parseBase64(dataString) {
  return parseBuffer(Buffer.from(dataString, 'base64'))
}

function parseBufferList(bufferList) {
  const messageChecksumLength = 4
  const messageSizeLength = 4
  const messages = getEmptyMessages()

  while (bufferList.length > messageChecksumLength + messageSizeLength) {
    // check for complete message in the buffer
    const messageChecksum = bufferList.readUIntLE(0, messageChecksumLength)
    const messageSize = messageSizeLength
      ? bufferList.readUIntLE(messageChecksumLength, messageSizeLength)
      : bufferList.length
    const minimalBufferLength =
      messageChecksumLength + messageSizeLength + messageSize
    if (bufferList.length < minimalBufferLength) break
    // extract and verify message
    const messageBin = bufferList.slice(
      messageChecksumLength + messageSizeLength,
      minimalBufferLength
    )

    // Smooth over environment consistencies between browser and node/tests
    const messageBuf =
      messageBin instanceof Buffer ? messageBin : Buffer.from(messageBin)

    const calcChecksum = messageChecksumLength
      ? getMessageChecksum(messageBuf)
      : messageChecksum
    const valid = messageChecksum === calcChecksum
    // deserialize and add message
    if (valid) {
      const message = deserializeBinary(messageBuf)
      addMessage(message, messages)
    } else {
      console.error('Invalid data in buffer')
    }
    bufferList.consume(minimalBufferLength)
  }

  return messages
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
  parseBufferList,
  parseImport,
}
