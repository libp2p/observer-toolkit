'use strict'

const { argv } = require('yargs')
const { createHash } = require('crypto')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')
const {
  Connection,
  EndpointPair,
  StreamList,
} = require('proto-def')

const {
  HOST_PEER_ID,
  DAY_IN_MS,
  DEFAULT_STREAMS,
  decodeBinToNum,
  encodeNumToBin,
  randomNormalDistribution,
  randomLatency,
  randomOpenClose,
} = require('../utils')
const { createTraffic, sumTraffic } = require('../messages/traffic')
const { createStream, mockStreamActivity, updateStream } = require('../messages/streams')
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
  const newStreamsCount = Math.ceil(0.5 + Math.random() * streamsPerConnection)

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

function updateConnection(connection, now) {
  const traffic = connection.getTraffic()
  const timeline = connection.getTimeline()
  const streamsArray = connection.getStreams().getStreamsList()
  const statusName = statusList.getItem(connection.getStatus())

  let newStatusName
  let secondsOpen = 1

  switch (statusName) {
    case 'OPENING':
      newStatusName = 'ACTIVE'
      secondsOpen = Math.random()
      mockConnectionTimeline({
        timeline,
        open: now - 1000 + secondsOpen * 1000,
      })
      addStreamsToConnection(connection, {
        secondsOpen,
        status: statusList.getNum('OPENING'),
        now,
      })
      break
    case 'CLOSING':
      newStatusName = 'CLOSED'
      mockConnectionTimeline({
        timeline,
        close: now - Math.random() * 1000,
      })
      break
    case 'ACTIVE':
      if (randomOpenClose()) {
        newStatusName = 'CLOSING'
        secondsOpen = Math.random()
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
  const msSinceOpening = Math.round(
    randomNormalDistribution({
      min: 1,
      max: 1.6 * DAY_IN_MS,
      skew: 12, // Mean around 4 minutes
    })
  )

  const status = connection.getStatus()

  const open = now - msSinceOpening
  const close = mockCloseTimeByStatus(status, open, now)

  const timeline = connection.getTimeline()
  mockConnectionTimeline({ timeline, open, close })

  addStreamsToConnection(connection, {
    status,
    secondsOpen: msSinceOpening / 1000,
    now,
  })

  const traffic = connection.getTraffic()

  sumTraffic(traffic, connection.getStreams().getStreamsList(), stream => {
    mockStreamActivity(stream, now)
  })
}

function mockConnectionTimeline({ timeline, open, close, upgraded }) {
  const openTs = open && new Timestamp([Math.round(open)])
  const closeTs = close && new Timestamp([Math.round(close)])
  const upgradedTs = upgraded && new Timestamp([Math.round(upgraded)])

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

function generateHashId() {
  const randomNumber = Math.pow(0.5 / Math.random(), 5 / Math.random())
  return createHash('sha256')
    .update(randomNumber.toString())
    .digest('hex')
}

module.exports = {
  createConnection,
  addStreamsToConnection,
  mockConnectionActivity,
  getTransportFromConnection,
  updateConnection,
}
