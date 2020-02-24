'use strict'

const { getSubsystems, getTime } = require('./states')

// Convenience functions for extracting connections (and their streams) from decoded protobuf

// Gets the first (or latest) occurence of each connection that exists in a data set, with optional filter
function getAllConnections(timepoints, { filter, latest = false } = {}) {
  const test = testConnection => !filter || filter(testConnection)

  const allConnections = timepoints.reduce((previousConns, timepoint) => {
    const newConns = getConnections(timepoint).filter(
      testConn =>
        test(testConn) &&
        !previousConns.some(
          existingConn =>
            testConn.getId().toString() === existingConn.getId().toString()
        )
    )
    if (!newConns.length) return previousConns
    return latest
      ? [...newConns, ...previousConns]
      : [...previousConns, ...newConns]
  }, [])

  return allConnections
}

// Gets the connections in one timepoint
function getConnections(timepoint) {
  const subsystems = getSubsystems(timepoint)
  return subsystems ? subsystems.getConnectionsList() : []
}

function getStreams(connection) {
  return connection.getStreams().getStreamsList()
}

function getAllStreamsAtTime(timepoint) {
  if (!timepoint) return []
  const connections = getConnections(timepoint)

  // Returns array of { connection, stream }
  const streams = connections.reduce(
    (streams, connection) => [
      ...streams,
      ...connection
        .getStreams()
        .getStreamsList()
        .map(stream => ({
          connection,
          stream,
        })),
    ],
    []
  )
  return streams
}

function _getAge(timeline, timepoint) {
  const openTs = timeline.getOpenTs()
  if (!openTs) return 0

  const closeTs = timeline.getCloseTs()
  const endTime = closeTs ? closeTs.getSeconds() : getTime(timepoint)
  return endTime - openTs.getSeconds()
}

function getConnectionAge(connection, timepoint) {
  return _getAge(connection.getTimeline(), timepoint)
}

function getStreamAge(stream, timepoint) {
  return _getAge(stream.getTimeline(), timepoint)
}

function _getTimeClosed(timeline, timepoint) {
  const closeTs = timeline.getCloseTs()
  if (!closeTs) return 0

  const endTime = getTime(timepoint)
  return endTime - closeTs.getSeconds()
}

function getConnectionTimeClosed(connection, timepoint) {
  return _getTimeClosed(connection.getTimeline(), timepoint)
}

function getStreamTimeClosed(stream, timepoint) {
  return _getTimeClosed(stream.getTimeline(), timepoint)
}

function _getTraffic(traffic, direction, type) {
  const byDirection = `getTraffic${direction === 'in' ? 'In' : 'Out'}`
  const byType = `getCum${type === 'bytes' ? 'Bytes' : 'Packets'}`
  return traffic[byDirection]()[byType]()
}

function getConnectionTraffic(connection, direction, type) {
  return _getTraffic(connection.getTraffic(), direction, type)
}

function getStreamTraffic(stream, direction, type) {
  return _getTraffic(stream.getTraffic(), direction, type)
}

module.exports = {
  getAllConnections,
  getAllStreamsAtTime,
  getConnections,
  getConnectionAge,
  getStreamAge,
  getConnectionTimeClosed,
  getStreamTimeClosed,
  getStreams,
  getConnectionTraffic,
  getStreamTraffic,
}
