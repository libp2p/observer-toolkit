'use strict'

const { Stream } = require('proto-def')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')

const { encodeNumToBin, randomLatency, randomOpenClose } = require('../utils')
const { protocolList } = require('../enums/protocolList')
const { roleList } = require('../enums/roleList')
const { statusList, randomChildStatus } = require('../enums/statusList')
const { createTraffic, mockTrafficRandomUpdate } = require('../messages/traffic')

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
  const stream = new Stream()

  lastId++
  stream.setId(encodeNumToBin(lastId))
  stream.setProtocol(protocol)
  stream.setConn(new Stream.ConnectionRef(connection))
  stream.setTimeline(createStreamTimeline({ open, close }))
  stream.setRole(role)
  stream.setTraffic(createTraffic())
  stream.setLatencyNs(latency)

  return stream
}

function updateStream(
  stream,
  { connectionStatusName, connectionSecondsOpen = 1, now }
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
      secondsOpen = Math.random() * connectionSecondsOpen
      mockStreamTimeline(stream.getTimeline(), {
        open: now - secondsOpen,
      })
      break
    case 'CLOSING':
      newStatusName = 'CLOSED'
      secondsOpen = Math.random() * connectionSecondsOpen
      mockStreamTimeline(stream.getTimeline(), {
        close: now - 1000 + secondsOpen * 1000,
      })
      break
    case 'ACTIVE':
      if (connectionStatusName === 'CLOSED') {
        newStatusName = 'CLOSED'
        mockStreamTimeline(stream.getTimeline(), {
          close: now - 1000 + secondsOpen * 1000,
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
  const secondsOpen = (activityEnd - open) / 1000
  mockTrafficRandomUpdate(stream.getTraffic(), secondsOpen)
}

function createStreamTimeline({ open = 0, close = 0 }) {
  const streamTimeline = new Stream.Timeline([open, close])

  return streamTimeline
}

function mockStreamTimeline(streamTimeline, { open, close }) {
  if (open) streamTimeline.setOpenTs(new Timestamp([Math.round(open)]))
  if (close) streamTimeline.setCloseTs(new Timestamp([Math.round(close)]))
}

module.exports = {
  createStream,
  updateStream,
  updateStreamConnection,
  mockStreamActivity,
}
