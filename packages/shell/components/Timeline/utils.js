import {
  getAllConnections,
  getConnections,
  getTime,
  getConnectionTraffic,
} from '@libp2p-observer/data'
import { validateNumbers } from '@libp2p-observer/sdk'

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
  // Can't calculate bytes added in first timepoint, so skip where index is 0
  const keyData = (dataset, keys) =>
    dataset.slice(1).map(
      // Get array of objects of mapped values added in each timepoint keyed by peerId
      (timepoint, previousTimepointIndex) => {
        const connectionsByKey = getConnections(timepoint).reduce(
          (connectionsByKey, connection) => {
            const key = getConnectionKey(connection)
            connectionsByKey[key] = connection
            return connectionsByKey
          },
          {}
        )

        const trafficByConn = keys.reduce(
          (trafficByConn, key) => {
            const connection = connectionsByKey[key]

            let bytes = 0

            if (connection) {
              bytes = getConnectionTraffic(connection, direction, 'bytes')

              // Use only those bytes added in this time point
              // Can't get bytes added first to previous, so skip it
              const previousTimepoint = dataset[previousTimepointIndex]
              const previousConn = getConnections(previousTimepoint).find(
                conn => getConnectionKey(conn) === key
              )
              if (previousConn) {
                bytes -= getConnectionTraffic(previousConn, direction, 'bytes')
              }
            }

            trafficByConn[key] = bytes
            return trafficByConn
          },
          { time: getTime(timepoint) }
        )
        validateNumbers(trafficByConn)
        return trafficByConn
      }
    )
  return keyData
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

function getConnectionKeys(dataset, sorter, applyFilters) {
  const allConnections = getAllConnections(dataset)
  const filteredConnections = allConnections.filter(applyFilters)
  filteredConnections.sort(sorter)
  const keys = filteredConnections.map(conn => getConnectionKey(conn))
  return keys
}

export {
  getTickOffsets,
  getTrafficChangesByConn,
  getTotalTraffic,
  getConnectionKeys,
}
