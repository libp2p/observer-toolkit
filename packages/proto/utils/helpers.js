'use strict'

// Convenience functions for extracting data from decoded protobuf

function getAge(time, openTs, closeTs) {
  if (!openTs) return 0
  const endTime = closeTs ? closeTs.getSeconds() : time
  return endTime - openTs.getSeconds()
}

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
  return timepoint ? timepoint.getSubsystems().getConnectionsList() : []
}

function getEnumByName(name, obj) {
  const entry = Object.entries(obj).find(([_, value]) => value === name)
  if (!entry)
    throw new Error(`"${name}" not one of "${Object.values(obj).join('", "')}"`)
  return parseInt(entry[0])
}

function getLatestTimepoint(timepoints) {
  if (!timepoints.length) return null
  return timepoints[timepoints.length - 1]
}

function getTime(timepoint, format) {
  const timestamp = timepoint.getInstantTs().getSeconds()
  // TODO: Check if protobuf treats timestamp as seconds not miliseconds

  if (!format) return timestamp
  // TODO: add date formating options
}

function getTimeIndex(timepoints, time) {
  let index = 0
  for (const timepoint of timepoints) {
    if (getTime(timepoint) === time) return index
    index++
  }
}

function getTraffic(connection, direction, type) {
  const byDirection = `getTraffic${direction === 'in' ? 'In' : 'Out'}`
  const byType = `getCum${type === 'bytes' ? 'Bytes' : 'Packets'}`
  return connection
    .getTraffic()
    [byDirection]()
    [byType]()
}

module.exports = {
  getAge,
  getAllConnections,
  getConnections,
  getEnumByName,
  getLatestTimepoint,
  getTime,
  getTimeIndex,
  getTraffic,
}
