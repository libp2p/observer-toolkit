'use strict'

const {
  proto: { DataGauge, Traffic },
} = require('@libp2p-observer/proto')

const {
  randomNormalDistribution,
  randomFluctuationMultiplier,
  randomBandwidth,
} = require('../utils')

// Store characteristics of a p2p node used for mocking
// that don't and can't exist in the proto definition
const mockTrafficProps = new Map()

function createTraffic() {
  const traffic = new Traffic()

  traffic.setTrafficIn(createDataGauge())
  traffic.setTrafficOut(createDataGauge())

  mockTrafficProps.set(traffic, {
    inOutRatio: randomFluctuationMultiplier(),
  })

  return traffic
}

function sumTraffic(traffic, itemsWithTraffic, prepFunc) {
  const dataIn = traffic.getTrafficIn()
  const dataOut = traffic.getTrafficOut()

  // TODO: simulate traffic from streams that closed before the sample start time
  // then perist this between samples without double-counting
  let cumBytesIn = 0
  let cumPacketsIn = 0
  let cumBytesOut = 0
  let cumPacketsOut = 0

  // eslint bug https://github.com/eslint/eslint/issues/12165
  // eslint-disable-next-line no-unused-vars
  for (const item of itemsWithTraffic) {
    if (prepFunc) prepFunc(item)

    const itemTraffic = item.getTraffic()
    const itemDataIn = itemTraffic.getTrafficIn()
    const itemDataOut = itemTraffic.getTrafficOut()

    cumBytesIn += itemDataIn.getCumBytes()
    cumPacketsIn += itemDataIn.getCumPackets()
    cumBytesOut += itemDataOut.getCumBytes()
    cumPacketsOut += itemDataOut.getCumPackets()
  }

  dataIn.setCumBytes(Math.round(cumBytesIn))
  dataIn.setCumPackets(Math.round(cumPacketsIn))
  dataOut.setCumBytes(Math.round(cumBytesOut))
  dataOut.setCumPackets(Math.round(cumPacketsOut))
}

function mockTrafficRandomUpdate(traffic, seconds) {
  mockDataGaugeRandomUpdate(traffic.getTrafficIn(), seconds)
  mockDataGaugeRandomUpdate(traffic.getTrafficOut(), seconds)
}

const mockDataGaugeProps = new Map()

function createDataGauge({ bandwidth = randomBandwidth() } = {}) {
  const dataGauge = new DataGauge()

  dataGauge.setCumBytes(0)
  dataGauge.setCumPackets(0)
  dataGauge.setInstBw(bandwidth)

  mockDataGaugeProps.set(dataGauge, {
    previousBandwidths: [bandwidth, bandwidth, bandwidth],
  })

  return dataGauge
}

function updateDataGauge(dataGauge, { bytes, packets, bandwidth }) {
  dataGauge.setCumBytes(dataGauge.getCumBytes() + bytes)
  dataGauge.setCumPackets(dataGauge.getCumPackets() + packets)

  if (bandwidth) dataGauge.setInstBw(bandwidth)
}

function mockDataGaugeBwFluctation(dataGauge) {
  const instBw = dataGauge.getInstBw()
  const { previousBandwidths } = mockDataGaugeProps.get(dataGauge)

  // Smooth against a rolling average so spikes don't always become step changes
  // like 2 2 3 2 3 6 3 4 3 3 2 not 2 2 3 2 3 6 6 7 6 5 6
  const rollingAverageValues = [
    ...previousBandwidths,
    instBw * randomFluctuationMultiplier(),
  ]

  const newInstBw =
    rollingAverageValues.reduce((acc, bw) => acc + bw, 0) /
    rollingAverageValues.length

  dataGauge.setInstBw(Math.round(newInstBw))
  previousBandwidths.shift()
  previousBandwidths.push(newInstBw)
}

function mockDataGaugeRandomUpdate(dataGauge, seconds = 1) {
  mockDataGaugeBwFluctation(dataGauge)
  const instBw = dataGauge.getInstBw()

  const bytes = Math.round(instBw * seconds)
  const packets = Math.round(
    randomNormalDistribution({
      min: 1,
      max: bytes,
      skew: 12, // For typical bandwidth, mean will be around 40 kbs per packet
    })
  )

  updateDataGauge(dataGauge, { bytes, packets })
}

module.exports = { createTraffic, sumTraffic, mockTrafficRandomUpdate }
