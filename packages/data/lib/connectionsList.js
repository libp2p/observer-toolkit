'use strict'

const { getEnumByName, statusNames } = require('./enums')
const { getSubsystems, getStateTime } = require('./states')

// Convenience functions for extracting connections (and their streams) from decoded protobuf

// Gets the first (or latest) occurence of each connection that exists in a data set, with optional filter
function getAllConnections(states, { filter, latest = false } = {}) {
  const test = testConnection => !filter || filter(testConnection)

  const allConnections = states.reduce((previousConns, state) => {
    const newConns = getConnections(state).filter(
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

// Gets the connections in one state
function getConnections(state) {
  const subsystems = getSubsystems(state)
  return subsystems ? subsystems.getConnectionsList() || [] : []
}

// Returns connections missing from states data as closed connections
function getMissingClosedConnections(currentState, states) {
  if (!currentState) return []

  const reversedStates = [...states].sort(
    (a, b) => getStateTime(b) - getStateTime(a)
  )
  const previousStates = reversedStates.slice(
    reversedStates.indexOf(currentState)
  )
  const currentConnections = getConnections(currentState)

  // Times for the first state in which a connection was absent
  // therefore it closed during that state's time interval
  let previousStateTime = getStateTime(currentState)
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
        connClone.getTimeline().setCloseTs(previousStateTime)

        return connClone
      })

      previousStateTime = getStateTime(state)
      return [...missingConnections, ...closedClones]
    },
    []
  )

  return missingConnections
}

function getConnectionId(connection) {
  return connection.getId().toString()
}

function getStreams(connection) {
  return connection.getStreams().getStreamsList()
}

function getAllStreamsAtTime(state) {
  if (!state) return []
  const connections = getConnections(state)

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

function _getAge(timeline, state) {
  const openTs = timeline.getOpenTs()
  if (!openTs || !state) return 0

  const closeTs = timeline.getCloseTs()
  const endTime = closeTs || getStateTime(state)
  return endTime - openTs
}

function getConnectionAge(connection, state) {
  return _getAge(connection.getTimeline(), state)
}

function getStreamAge(stream, state) {
  return _getAge(stream.getTimeline(), state)
}

function _getTimeClosed(timeline, state) {
  const closeTs = timeline.getCloseTs()
  if (!closeTs || !state) return 0

  const endTime = getStateTime(state)
  return endTime - closeTs
}

function getConnectionTimeClosed(connection, state) {
  return _getTimeClosed(connection.getTimeline(), state)
}

function getStreamTimeClosed(stream, state) {
  return _getTimeClosed(stream.getTimeline(), state)
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
