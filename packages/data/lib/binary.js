'use strict'

const { deserializeBinary, fnv1a } = require('@libp2p/observer-proto')

const getEmptyMessages = () => ({
  states: [],
  events: [],
  runtime: null,
  responses: [],
  notices: [],
})

function getMessageChecksum(buffer) {
  return fnv1a(buffer)
}

function parseBuffer(buf, deserialize = deserializeBinary) {
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
      addMessageContent(messageBin, messages, deserialize)
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
  const responseContent = message.getResponse()
  const noticeContent = message.getNotice()

  if (stateContent) {
    messages.states.push(stateContent)
  }
  if (eventContent) {
    messages.events.push(eventContent)
  }
  if (runtimeContent) {
    // Only one runtime at a time
    messages.runtime = runtimeContent
  }
  if (responseContent) {
    messages.responses.push(responseContent)
  }
  if (noticeContent) {
    messages.notices.push(noticeContent)
  }
}

function addMessageContent(messageBin, messages, deserialize) {
  const message = deserialize(messageBin)
  addMessage(message, messages)
}

function parseArrayBuffer(arrayBuf, deserialize) {
  return parseBuffer(Buffer.from(arrayBuf), deserialize)
}

function parseBase64(dataString, deserialize) {
  return parseBuffer(Buffer.from(dataString, 'base64'), deserialize)
}

function parseBufferList(bufferList, deserialize = deserializeBinary) {
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

    if (valid) {
      const message = deserialize(messageBuf)
      addMessage(message, messages)
    } else {
      console.error('Invalid data in buffer')
    }
    bufferList.consume(minimalBufferLength)
  }

  return messages
}

function parseImport(rawData, deserialize) {
  if (rawData instanceof Buffer) return parseBuffer(rawData, deserialize)
  if (rawData instanceof ArrayBuffer)
    return parseArrayBuffer(rawData, deserialize)
  if (rawData instanceof String) return parseBase64(rawData, deserialize)
  return parseBufferList(rawData, deserialize)
}

module.exports = {
  parseArrayBuffer,
  parseBase64,
  parseBuffer,
  parseBufferList,
  parseImport,
}
