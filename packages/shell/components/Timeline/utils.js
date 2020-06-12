import {
  getAllConnections,
  getConnections,
  getConnectionTraffic,
  getStateTimes,
} from '@libp2p/observer-data'
import { validateNumbers } from '@libp2p/observer-sdk'

// Gaps between state messages above this will be treated as missing data
const GAP_TOLERANCE_MS = 50

function getTickOffsets(ticks, scale) {
  const tickGap = ticks[1] - ticks[0]

  const firstTickGap = ticks[0] - scale.domain()[0]
  const lastTickGap = scale.domain()[1] - ticks[ticks.length - 1]

  const totalGapValues =
    firstTickGap + tickGap * (ticks.length - 1) + lastTickGap

  const firstTickOffset = firstTickGap / totalGapValues
  const tickOffset = tickGap / totalGapValues

  const tickOffsets = Array(ticks.length)
    .fill()
    .map((_, i) => firstTickOffset + i * tickOffset)

  return tickOffsets
}

function getTrafficChangesByConn(direction) {
  // Can't calculate bytes added in first state, so skip where index is 0
  const keyData = (states, keys) => {
    const keyedStates = states.slice(1).reduce(
      // Get array of objects of mapped values added in each state keyed by connection
      (keyedStates, state, previousStateIndex) => {
        const connectionsByKey = keyByConnections(state)
        const { start, end } = getStateTimes(state)

        const previousState = states[previousStateIndex]
        const connectionTrafficReducer = getConnectionTrafficReducer(
          connectionsByKey,
          previousState,
          direction
        )

        const trafficByConn = keys.reduce(connectionTrafficReducer, {
          start,
          end,
        })

        validateNumbers(trafficByConn)
        return insertGapsBetweenStates(trafficByConn, keyedStates, start, keys)
      },
      []
    )
    const { start, end } = getStateTimes(states[0])
    return [{ ...keyedStates[0], start, end }, ...keyedStates]
  }
  return keyData
}

function getConnectionTrafficReducer(
  connectionsByKey = null,
  previousState = null,
  direction = null
) {
  return (trafficByConn, key) => {
    const connection = connectionsByKey ? connectionsByKey[key] : null
    if (!connection) {
      trafficByConn[key] = 0
      return trafficByConn
    }

    let bytes = getConnectionTraffic(connection, direction, 'bytes')

    // Use only those bytes added in this state
    const previousConn = getConnections(previousState).find(
      conn => getConnectionKey(conn) === key
    )
    if (previousConn) {
      bytes -= getConnectionTraffic(previousConn, direction, 'bytes')
    }

    // A negative value for bytes is impossible unless the introspector has an unexpected
    // behaviour e.g. correcting for a past error. We can't control that, so be defensive
    trafficByConn[key] = Math.max(0, bytes)
    return trafficByConn
  }
}

function insertGapsBetweenStates(trafficByConn, keyedStates, start, keys) {
  if (!keyedStates.length) return [trafficByConn]

  const lastKeyedState = keyedStates[keyedStates.length - 1]
  const previousEnd = lastKeyedState.end
  const gapMs = start - previousEnd
  if (gapMs <= GAP_TOLERANCE_MS) return [...keyedStates, trafficByConn]

  const emptyConnectionReducer = getConnectionTrafficReducer()
  const gapStart = keys.reduce(emptyConnectionReducer, {
    start: previousEnd,
    end: start,
    noData: true,
  })
  const gapEnd = Object.assign({}, lastKeyedState, {
    start,
    end: start,
  })

  return [...keyedStates, gapStart, gapEnd, trafficByConn]
}

function keyByConnections(state) {
  return getConnections(state).reduce((connectionsByKey, connection) => {
    const key = getConnectionKey(connection)
    connectionsByKey[key] = connection
    return connectionsByKey
  }, {})
}

function getTotalTraffic(connection) {
  const dataIn = getConnectionTraffic(connection, 'in', 'bytes')
  const dataOut = getConnectionTraffic(connection, 'out', 'bytes')
  validateNumbers(dataIn, dataOut)
  return dataIn + dataOut
}

function getConnectionKey(connection) {
  return `${connection.getPeerId()}_${connection.getId()}`
}

function getConnectionKeys(states, sorter, applyFilters) {
  const allConnections = getAllConnections(states)
  const filteredConnections = allConnections.filter(applyFilters)
  filteredConnections.sort(sorter)
  const keys = filteredConnections.map(conn => getConnectionKey(conn))
  return keys
}

function getStateWidth(state, overallDuration, width) {
  return (getStateTimes(state).duration / overallDuration) * width
}

function validateStateIndex(stateIndex, states) {
  const lastStateIndex = states.length - 1
  if (stateIndex < 0) return lastStateIndex
  return Math.min(stateIndex, lastStateIndex)
}

export {
  getTickOffsets,
  getTrafficChangesByConn,
  getTotalTraffic,
  getConnectionKeys,
  getStateWidth,
  validateStateIndex,
}
