import { useMemo } from 'react'
import { State } from '../src/introspection_pb'

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

function useCurrentTime(dataset, time) {
  const currentTimepoint = useMemo(
    () =>
      dataset.find(timepoint => getTime(timepoint) >= time) ||
      getDefaultTime(dataset),
    [dataset, time]
  )

  return currentTimepoint
}

function getDefaultTime(dataset) {
  if (!dataset.length) return 0
  const lastTimepoint = dataset[dataset.length - 1]
  return getTime(lastTimepoint)
}

function getTime(timepoint, format) {
  const timestamp = timepoint.getInstantTs().getSeconds()
  // TODO: Check if protobuf treats timestamp as seconds not miliseconds

  if (!format) return timestamp
  // TODO: add date formating options
}

function getTraffic(connection, direction, type) {
  const byDirection = `getTraffic${direction === 'in' ? 'In' : 'Out'}`
  const byType = `getCum${type === 'bytes' ? 'Bytes' : 'Packets'}`
  return connection
    .getTraffic()
    [byDirection]()
    [byType]()
}

function getConnections(timepoint) {
  return timepoint.getSubsystems().getConnectionsList()
}

function getTimeIndex(dataset, time) {
  let index = 0
  for (const timepoint of dataset) {
    if (getTime(timepoint) === time) return index
    index++
  }
}

function getAge(time, openTs, closeTs) {
  if (!openTs) return 0
  const endTime = closeTs ? closeTs.getSeconds() : time
  return endTime - openTs.getSeconds()
}

// Temporary function for temp tooltip placeholder - flattens jsx-ified template strings
// Remove this as soon as it's not needed
function childrenToString(children) {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.join('')
  if (!children) return ''
}

export {
  parseBuffer,
  useCurrentTime,
  getDefaultTime,
  getTime,
  getTraffic,
  getConnections,
  getTimeIndex,
  getAge,
  childrenToString,
}
