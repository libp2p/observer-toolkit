'use strict'

const { BufferList } = require('bl')
const { deserializeBinary, fnv1a } = require('@libp2p-observer/proto')

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
  const messages = {
    states: [],
    runtime: null,
  }

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

  if (stateContent) {
    messages.states.push(stateContent)
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
  const messages = {
    states: [],
    runtime: null,
  }
  let runtimeInfoBufferList = new BufferList()

  while (bufferList.length > messageChecksumLength + messageSizeLength) {
    // check for complete message in the buffer
    const messageChecksum = bufferList.readUIntLE(0, messageChecksumLength)
    const messageSize = bufferList.readUIntLE(4, messageSizeLength)
    const minimalBufferLength =
      messageChecksumLength + messageSizeLength + messageSize
    if (bufferList.length <= minimalBufferLength) break
    // extract and verify message
    const messageBuffer = new Buffer(minimalBufferLength + 4)
    bufferList.copy(messageBuffer, 4, 0, minimalBufferLength)
    const checksumBuffer = messageBuffer.slice(12)
    const calcChecksum = getMessageChecksum(checksumBuffer)
    const valid = messageChecksum === calcChecksum
    // deserialize and add message (keep runtime info)
    if (valid) {
      const message = deserializeBinary(checksumBuffer)
      const isRuntimeInfo = Boolean(message.getRuntime())
      if (isRuntimeInfo) {
        runtimeInfoBufferList.append(bufferList.slice(0, minimalBufferLength))
      }
      addMessage(message, messages)
    }
    bufferList = bufferList.shallowSlice(minimalBufferLength)
  }

  // combine runtime info and remainder
  const remainingBuffer = new Buffer(bufferList.length)
  bufferList.copy(remainingBuffer)
  bufferList.consume(bufferList.length)
  bufferList.append(runtimeInfoBufferList).append(remainingBuffer)

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
