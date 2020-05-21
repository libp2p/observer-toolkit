'use strict'

const { proto } = require('@nearform/observer-proto')

const {
  SECOND_IN_MS,
  encodeNumToBin,
  random,
  randomLatency,
  randomOpenClose,
  createTimestamp,
} = require('../utils')
const { protocolList } = require('../enums/protocolList')
const { roleList } = require('../enums/roleList')
const { statusList, randomChildStatus } = require('../enums/statusList')
const {
  createTraffic,
  mockTrafficRandomUpdate,
} = require('../messages/traffic')

// Ensure each created stream gets a unique ID
let lastId = 0

function createStream({
  status = statusList.getRandom(),
  protocol = protocolList.getRandom(1),
  connection,
  open,
  close,
  latency = randomLatency(),
  role = roleList.getRandom(),
} = {}) {
  const stream = new proto.Stream()

  lastId++
  stream.setId(encodeNumToBin(lastId))
  stream.setProtocol(protocol)
  stream.setConn(new proto.Stream.ConnectionRef(connection))
  stream.setTimeline(createStreamTimeline({ open, close }))
  stream.setRole(role)
  stream.setTraffic(createTraffic())
  stream.setLatencyNs(latency)

  return stream
}

function updateStream(
  stream,
  { connectionStatusName, connectionSecondsOpen = 1, now, duration }
) {
  const statusNum = stream.getStatus()

  if (isNaN(statusNum)) {
    stream.setStatus(randomChildStatus(statusList.getNum(connectionStatusName)))
    return
  }

  const statusName = statusList.getItem(statusNum)
  let newStatusName
  let secondsOpen = connectionSecondsOpen

  switch (statusName) {
    case 'OPENING':
      newStatusName = 'ACTIVE'
      secondsOpen = random() * connectionSecondsOpen
      mockStreamTimeline(stream.getTimeline(), {
        open: now - secondsOpen,
      })
      break
    case 'CLOSING':
      newStatusName = 'CLOSED'
      secondsOpen = random() * connectionSecondsOpen
      mockStreamTimeline(stream.getTimeline(), {
        close: now - duration + secondsOpen * SECOND_IN_MS,
      })
      break
    case 'ACTIVE':
      if (connectionStatusName === 'CLOSED') {
        newStatusName = 'CLOSED'
        mockStreamTimeline(stream.getTimeline(), {
          close: now - duration + secondsOpen * SECOND_IN_MS,
        })
        secondsOpen = 0
      } else if (connectionStatusName === 'CLOSING' || randomOpenClose()) {
        newStatusName = 'CLOSING'
      }
      break
    default:
      // No traffic or change if closed or error
      return
  }
  if (secondsOpen) mockTrafficRandomUpdate(stream.getTraffic(), secondsOpen)
  if (newStatusName) stream.setStatus(statusList.getNum(newStatusName))
}

function updateStreamConnection(stream, connection) {
  stream.setConn(connection.getId())
}

function mockStreamActivity(stream, now) {
  const timeline = stream.getTimeline()
  const open = timeline.getOpenTs()
  if (!open) return

  const activityEnd = timeline.getCloseTs() || now
  const secondsOpen = (activityEnd - open) / SECOND_IN_MS
  mockTrafficRandomUpdate(stream.getTraffic(), secondsOpen)
}

function createStreamTimeline({ open = 0, close = 0 }) {
  const streamTimeline = new proto.Stream.Timeline([open, close])

  return streamTimeline
}

function mockStreamTimeline(streamTimeline, { open, close }) {
  if (open) streamTimeline.setOpenTs(createTimestamp(open))
  if (close) streamTimeline.setCloseTs(createTimestamp(close))
}

module.exports = {
  createStream,
  updateStream,
  updateStreamConnection,
  mockStreamActivity,
}
