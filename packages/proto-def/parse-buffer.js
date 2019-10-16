import { State } from './introspection_pb'

function parseBuffer(buf, byteLength = Buffer.byteLength(buf)) {
  // Expects a binary file with this repeating structure:
  // - 4-byte version number
  // - 4-byte length of following State message
  // - State message

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

export default parseBuffer
