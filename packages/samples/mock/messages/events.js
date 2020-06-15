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

const PeerConnecting = require('../event-types/PeerConnecting')
const PeerDisconnecting = require('../event-types/PeerDisconnecting')
const InboundDHTQuery = require('../event-types/InboundDHTQuery')
const OutboundDHTQuery = require('../event-types/OutboundDHTQuery')
const eventTypes = {
  PeerConnecting,
  PeerDisconnecting,
  InboundDHTQuery,
  OutboundDHTQuery,
}

function createEvent({
  now = Date.now(),
  type = '',
  content = {},
  runtime,
} = {}) {
  const event = new Event()

  if (
    !eventTypes[type] ||
    (runtime &&
      runtime
        .getEventTypesList()
        .some(eventType => eventType.getName() === type))
  ) {
    // Known event type or dummy event type, send name only
    event.setType(new EventType([type]))
  } else {
    // Novel real event type, send full type metadata
    const eventType = eventTypes[type]
    event.setType(eventType)
    if (runtime) runtime.addEventTypes(eventType)
  }

  event.setTs(new Timestamp([now]))
  event.setContent(JSON.stringify(content))
  return event
}

function generateEvent({
  now = Date.now(),
  type = '',
  content = {},
  runtime,
} = {}) {
  const event = createEvent({ now, type, content, runtime })
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
