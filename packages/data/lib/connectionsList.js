'use strict'

const { getEnumByName, statusNames } = require('./enums')
const { getSubsystems, getStateTimes, getTime } = require('./states')

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
            getConnectionId(testConn) === getConnectionId(existingConn)
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

// Returns connections missing from states data as closed connections
function getMissingClosedConnections(currentState, states) {
  if (!currentState) return []

  const now = performance.now()

  const reversedStates = [...states].sort(
    (a, b) => getStateTimes(b).end - getStateTimes(a).end
  )
  const previousStates = reversedStates.slice(
    reversedStates.indexOf(currentState)
  )
  const currentConnections = getConnections(currentState)

  // Times for the first state in which a connection was absent
  // therefore it closed during that state's time interval
  let previousStateTime = getStateTimes(currentState)
  let foundConnIds = currentConnections.map(conn => getConnectionId(conn))

  // Find missing connections from most recent state they were in
  const missingConnections = previousStates.reduce(
    (missingConnections, state) => {
      const newClosedConns = getConnections(state).filter(
        conn =>
          statusNames[conn.getStatus()] === 'ACTIVE' &&
          !foundConnIds.includes(getConnectionId(conn))
      )
      const newConnIds = newClosedConns.map(conn => getConnectionId(conn))
      foundConnIds = [...foundConnIds, ...newConnIds]

      const closedClones = newClosedConns.map(connection => {
        const connClone = connection.clone()
        connClone.setStatus(getEnumByName('CLOSED', statusNames))

        // When closed connections are absent, we don't have a `close_ts`
        // so the best we can do is report the middle of the possible range
        const { start, end } = previousStateTime
        const closeTimeEstimate = (start + end) / 2
        connClone.getTimeline().setCloseTs(closeTimeEstimate)

        return connClone
      })

      previousStateTime = getStateTimes(state)
      return [...missingConnections, ...closedClones]
    },
    []
  )

  console.log(missingConnections.length, performance.now() - now)
  return missingConnections
}

function getConnectionId(connection) {
  return connection.getId().toString()
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
  const endTime = closeTs || getTime(timepoint)
  return endTime - openTs
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
  return endTime - closeTs
}

function getConnectionTimeClosed(connection, timepoint) {
  return _getTimeClosed(connection.getTimeline(), timepoint)
}

function getStreamTimeClosed(stream, timepoint) {
  return _getTimeClosed(stream.getTimeline(), timepoint)
}

function _getTraffic(traffic, direction, type) {
  const byDirection = `getTraffic${direction === 'in' ? 'In' : 'Out'}`

  if (type === 'instBw') return traffic[byDirection]().getInstBw()

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
  getMissingClosedConnections,
  getConnectionId,
  getConnectionAge,
  getStreamAge,
  getConnectionTimeClosed,
  getStreamTimeClosed,
  getStreams,
  getConnectionTraffic,
  getStreamTraffic,
}
