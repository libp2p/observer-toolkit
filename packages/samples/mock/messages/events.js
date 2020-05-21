'use strict'

const {
  proto: { Event, EventType },
} = require('@libp2p/observer-proto')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')

const { createBufferSegment } = require('../../output/binary')

const { transportList } = require('../enums/transportList')
const { roleList } = require('../enums/roleList')
const { decodeBinToNum } = require('../utils')

const { createEventServerMessage } = require('./server-message')

function createEvent({ now = Date.now(), type = '', content = {} } = {}) {
  const event = new Event()

  event.setType(new EventType([type]))
  event.setTs(new Timestamp([now]))
  event.setContent(JSON.stringify(content))
  return event
}

function generateEvent({ now = Date.now(), type = '', content = {} } = {}) {
  const event = createEvent({ now, type, content })
  const eventPacket = createEventServerMessage(event)
  return createBufferSegment(eventPacket)
}

function _getPeerEventContent(now, connection) {
  return {
    peerId: connection.getPeerId(),
    transport: transportList.getItem(
      decodeBinToNum(connection.getTransportId())
    ),
  }
}

function getPeerDisconnectingProps(now, connection) {
  const content = _getPeerEventContent(now, connection)
  const open = connection.getTimeline().getOpenTs()
  content.age = `${now - open}`
  content.openTime = `${open}`
  return { now, type: 'PeerDisconnecting', content }
}

function getPeerConnectingProps(now, connection) {
  const content = _getPeerEventContent(now, connection)
  content.role = roleList.getItem(connection.getRole())
  return { now, type: 'PeerConnecting', content }
}

module.exports = {
  createEvent,
  generateEvent,
  getPeerConnectingProps,
  getPeerDisconnectingProps,
}
