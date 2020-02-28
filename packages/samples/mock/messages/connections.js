'use strict'

const { argv } = require('yargs')
const {
  proto: { Connection, EndpointPair, StreamList },
} = require('@libp2p-observer/proto')

const {
  HOST_PEER_ID,
  HOUR_IN_SECONDS,
  DEFAULT_STREAMS,
  decodeBinToNum,
  encodeNumToBin,
  random,
  randomNormalDistribution,
  randomLatency,
  randomOpenClose,
  generateHashId,
  createTimestamp,
} = require('../utils')
const { createTraffic, sumTraffic } = require('../messages/traffic')
const {
  createStream,
  mockStreamActivity,
  updateStream,
} = require('../messages/streams')
const { encryptionList } = require('../enums/encryptionList')
const { multiplexerList } = require('../enums/multiplexerList')
const { roleList } = require('../enums/roleList')
const {
  statusList,
  mockCloseTimeByStatus,
  mockOpenTimeByStatus,
  randomChildStatus,
} = require('../enums/statusList')
const { transportList } = require('../enums/transportList')

// Ensure each connection gets a unique ID
let lastId = 0
const { streams: streamsPerConnection = DEFAULT_STREAMS } = argv

function createConnection({
  peerId = generateHashId(),
  open,
  status = statusList.getRandom(),
  transportId = transportList.getRandom(),
  multiplexer = multiplexerList.getRandom(1),
  encryption = encryptionList.getRandom(1),
  role = roleList.getRandom(),
  latency = randomLatency(),
} = {}) {
  const connection = new Connection()

  lastId++
  connection.setId(encodeNumToBin(lastId))
  connection.setStatus(status)
  connection.setTransportId(encodeNumToBin(transportId))
  connection.setPeerId(peerId)
  connection.setRole(role)

  connection.setTraffic(createTraffic())
  connection.setAttribs(new Connection.Attributes([multiplexer, encryption]))
  connection.setTimeline(
    new Connection.Timeline(mockConnectionTimeline({ open }))
  )

  connection.setEndpoints(
    new EndpointPair(
      role === roleList.getNum('INITIATOR')
        ? [HOST_PEER_ID, peerId]
        : [peerId, HOST_PEER_ID]
    )
  )
  connection.setLatencyNs(latency)

  return connection
}

function addStreamsToConnection(connection, { secondsOpen, now }) {
  const newStreamsCount = Math.ceil(0.5 + random() * streamsPerConnection)

  const streamList = new StreamList()

  let streamsAdded = 0
  while (streamsAdded < newStreamsCount) {
    const streamStatus = randomChildStatus(connection.getStatus())
    const open = mockOpenTimeByStatus(streamStatus, secondsOpen, now)
    const close = mockCloseTimeByStatus(streamStatus, open, now)

    const stream = createStream({
      status: streamStatus,
      connection,
      open,
      close,
    })
    mockStreamActivity(stream, now)
    streamList.addStreams(stream)

    streamsAdded++
  }
  connection.setStreams(streamList)
}

function updateConnection(connection, now, duration) {
  const traffic = connection.getTraffic()
  const timeline = connection.getTimeline()
  const streamsArray = connection.getStreams().getStreamsList()
  const statusName = statusList.getItem(connection.getStatus())

  let newStatusName
  let secondsOpen = 1

  switch (statusName) {
    case 'OPENING':
      newStatusName = 'ACTIVE'
      secondsOpen = random()
      mockConnectionTimeline({
        timeline,
        open: now - duration + secondsOpen * 1000,
      })
      break
    case 'CLOSING':
      newStatusName = 'CLOSED'
      mockConnectionTimeline({
        timeline,
        close: now - random() * duration,
      })
      break
    case 'ACTIVE':
      if (randomOpenClose()) {
        newStatusName = 'CLOSING'
        secondsOpen = random()
      }
      break
    default:
      // No traffic or change if closed or error
      return
  }

  if (newStatusName) connection.setStatus(statusList.getNum(newStatusName))
  streamsArray.forEach(stream => {
    updateStream(stream, {
      connectionStatusName: newStatusName,
      connectionSecondsOpen: secondsOpen,
      now,
    })
  })

  if (statusList.getItem(connection.getStatus()) === 'ACTIVE') {
    sumTraffic(traffic, streamsArray)
    if (randomOpenClose()) {
      // Close the connection
      const closingStatus = statusList.getNum('CLOSING')
      connection.setStatus(closingStatus)
      streamsArray.forEach(stream => stream.setStatus(closingStatus))
    } else if (randomOpenClose(streamsPerConnection)) {
      // Open a new stream
      const newStream = createStream({
        status: statusList.getNum('OPENING'),
        connection,
      })
      const streamList = connection.getStreams()
      streamList.addStreams(newStream)
    }
  }
}

function mockConnectionActivity(connection, now) {
  const msOpen = Math.round(
    randomNormalDistribution({
      min: 1,
      max: HOUR_IN_SECONDS * 1000,
      skew: 6, // Mean 2 mins
    })
  )

  const status = connection.getStatus()

  const open = now - msOpen
  const close = mockCloseTimeByStatus(status, open, now)

  const timeline = connection.getTimeline()
  mockConnectionTimeline({ timeline, open, close })

  addStreamsToConnection(connection, {
    status,
    secondsOpen: msOpen / 1000,
    now,
  })

  const traffic = connection.getTraffic()

  sumTraffic(traffic, connection.getStreams().getStreamsList(), stream => {
    mockStreamActivity(stream, now)
  })
}

function mockConnectionTimeline({ timeline, open, close, upgraded }) {
  const openTs = open && createTimestamp(open)
  const closeTs = close && createTimestamp(close)
  const upgradedTs = upgraded && createTimestamp(upgraded)

  if (!timeline) return [openTs, closeTs, upgradedTs]

  if (openTs) timeline.setOpenTs(openTs)
  if (closeTs) timeline.setCloseTs(closeTs)
  if (upgradedTs) timeline.setUpgradedTs(upgradedTs)
}

function getTransportFromConnection(connection) {
  // In real LibP2P, transports are stored on the swarm
  // How to preserve refs to transports across restarts is unresolved
  return transportList.getItem(decodeBinToNum(connection.getTransportId()))
}

module.exports = {
  createConnection,
  addStreamsToConnection,
  mockConnectionActivity,
  getTransportFromConnection,
  updateConnection,
}
