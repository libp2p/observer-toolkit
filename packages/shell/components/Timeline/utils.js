import {
  getAllConnections,
  getConnections,
  getTime,
  getTraffic,
} from '@libp2p-observer/data'
import { validateNumbers } from '@libp2p-observer/sdk'

function getTrafficChangesByPeer(direction) {
  // Can't calculate bytes added in first timepoint, so skip where index is 0
  const keyData = (dataset, keys) =>
    dataset.slice(1).map(
      // Get array of objects of mapped values added in each timepoint keyed by peerId
      (timepoint, previousTimepointIndex) => {
        const connectionsById = getConnections(timepoint).reduce(
          (connectionsById, connection) => {
            connectionsById[connection.getPeerId()] = connection
            return connectionsById
          },
          {}
        )

        const trafficByPeer = keys.reduce(
          (trafficByPeer, peerId) => {
            const connection = connectionsById[peerId]

            let bytes = 0

            if (connection) {
              bytes = getTraffic(connection, direction, 'bytes')

              // Use only those bytes added in this time point
              // Can't get bytes added first to previous, so skip it
              const previousTimepoint = dataset[previousTimepointIndex]
              const previousConn = getConnections(previousTimepoint).find(
                conn => conn.getPeerId() === peerId
              )
              if (previousConn) {
                bytes -= getTraffic(previousConn, direction, 'bytes')
              }
            }

            trafficByPeer[peerId] = bytes
            return trafficByPeer
          },
          { time: getTime(timepoint) }
        )
        validateNumbers(trafficByPeer)
        return trafficByPeer
      }
    )
  return keyData
}

function getTotalTraffic(connection) {
  const dataIn = getTraffic(connection, 'in', 'bytes')
  const dataOut = getTraffic(connection, 'out', 'bytes')
  validateNumbers(dataIn, dataOut)
  return dataIn + dataOut
}

function getPeerIds(dataset, sorter, applyFilters) {
  const allConnections = getAllConnections(dataset)
  const filteredConnections = allConnections.filter(applyFilters)
  filteredConnections.sort(sorter)
  return filteredConnections.map(conn => conn.getPeerId())
}

export { getTrafficChangesByPeer, getTotalTraffic, getPeerIds }
