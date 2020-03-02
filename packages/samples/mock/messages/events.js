'use strict'

const {
  proto: { Event },
} = require('@libp2p-observer/proto')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')

const { transportList } = require('../enums/transportList')
const { roleList } = require('../enums/roleList')
const { decodeBinToNum } = require('../utils')

function createEvent({ now = Date.now(), type = '', content = {} } = {}) {
  const event = new Event()

  event.setType(type)
  event.setTs(new Timestamp([now]))
  const contentMap = event.getContentMap()
  Object.keys(content).forEach(key => {
    contentMap.set(key, content[key])
  })
  return event
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
  const open = connection
    .getTimeline()
    .getOpenTs()
    .getSeconds()
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
  getPeerConnectingProps,
  getPeerDisconnectingProps,
}
