import { area, scaleLinear, scaleTime, stack } from 'd3'

import { getLatestTimepoint, getTime, getTraffic, getConnections } from 'proto'
import { validateNumbers } from '../../utils/helpers'

function getMaxAreaPeak(stackedData) {
  return stackedData.reduce(
    (maxOverall, timeDatum) =>
      Math.max(
        maxOverall,
        timeDatum.reduce(
          (maxHere, connDatum) =>
            // connDatum[1] is the upper point in a stacked area slice
            Math.max(maxHere, connDatum[1]),
          0
        )
      ),
    0
  )
}

function getTrafficOverTime(dataset, allPeerIds, direction) {
  return dataset.reduce(
    // Get array of objects of bytes added in each timepoint keyed by peerId
    // Can't calculate bytes added in first timepoint, so skip where index is 0
    (timepoints, timepoint, timeIndex) =>
      !timeIndex
        ? []
        : [
            ...timepoints,
            getTrafficForAllPeers(
              dataset,
              timepoint,
              timeIndex,
              allPeerIds,
              direction
            ),
          ],
    []
  )
}

function getTrafficForAllPeers(
  dataset,
  timepoint,
  timeIndex,
  allPeerIds,
  direction
) {
  const connectionsById = getConnections(timepoint).reduce(
    (connectionsById, connection) => {
      connectionsById[connection.getPeerId()] = connection
      return connectionsById
    },
    {}
  )

  const trafficByPeer = allPeerIds.reduce(
    (trafficByPeer, peerId) => {
      const connection = connectionsById[peerId]

      let bytes = 0

      if (connection) {
        bytes = getTraffic(connection, direction, 'bytes')

        // Use only those bytes added in this time point
        // Can't get bytes added first to previous, so skip it
        const previousTimepoint = dataset[timeIndex - 1]
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

function stackData(dataset) {
  const allConnections = dataset.reduce(
    (allConns, timepoint) => [
      ...getConnections(timepoint).filter(
        testConn =>
          !allConns.some(
            existingConn => testConn.getPeerId() === existingConn.getPeerId()
          )
        // Reverse the array so the sorter sees the last occurence of each connection
      ),
      ...allConns,
    ],
    []
  )

  allConnections.sort((a, b) => {
    const aIn = getTraffic(a, 'in', 'bytes')
    const bIn = getTraffic(b, 'in', 'bytes')
    const aOut = getTraffic(a, 'out', 'bytes')
    const bOut = getTraffic(b, 'out', 'bytes')

    const aTotal = aIn + aOut
    const bTotal = bIn + bOut
    return bTotal - aTotal
  })

  const allPeerIds = allConnections.map(conn => conn.getPeerId())
  const dataStacker = stack().keys(allPeerIds)

  const dataInOverTime = getTrafficOverTime(dataset, allPeerIds, 'in')
  const dataOutOverTime = getTrafficOverTime(dataset, allPeerIds, 'out')

  const stackedDataIn = dataStacker(dataInOverTime)
  const stackedDataOut = dataStacker(dataOutOverTime)

  const maxIn = getMaxAreaPeak(stackedDataIn)
  const maxOut = getMaxAreaPeak(stackedDataOut)

  const xScale = scaleTime()
  const yScaleIn = scaleLinear()
  const yScaleOut = scaleLinear()

  const minTime = getTime(dataset[0])
  const maxTime = getLatestTimepoint(dataset).getInstantTs()

  validateNumbers({
    maxIn,
    maxOut,
    minTime,
    maxTime,
  })

  xScale.domain([minTime, maxTime])
  yScaleIn.domain([0, maxIn])
  yScaleOut.domain([0, maxOut])

  return {
    stackedDataIn,
    stackedDataOut,
    xScale,
    yScaleIn,
    yScaleOut,
  }
}

function fitDataToPaths(fitDataArgs) {
  const [
    availableWidth,
    availableHeight,
    stackedDataIn,
    stackedDataOut,
    xScale,
    yScaleIn,
    yScaleOut,
  ] = fitDataArgs

  xScale.range([0, availableWidth])
  yScaleIn.range([availableHeight, 0])
  yScaleOut.range([0, availableHeight])

  const areaMakerIn = area()
    .x(d => xScale(d.data.time))
    .y0(d => yScaleIn(d[0]))
    .y1(d => yScaleIn(d[1]))

  const areaMakerOut = area()
    .x(d => xScale(d.data.time))
    .y0(d => yScaleOut(d[0]))
    .y1(d => yScaleOut(d[1]))

  const dataInPathDefs = stackedDataIn.map(datum => ({
    pathDef: areaMakerIn(datum),
    peerId: datum.key,
  }))
  const dataOutPathDefs = stackedDataOut.map(datum => ({
    pathDef: areaMakerOut(datum),
    peerId: datum.key,
  }))

  return {
    dataInPathDefs,
    dataOutPathDefs,
  }
}

export { getMaxAreaPeak, getTrafficOverTime, stackData, fitDataToPaths }
