'use strict'

const {
  proto: { Event },
} = require('@libp2p-observer/proto')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')

function createEvent({
    now = Date.now(),
    type = ''
} = {}) {
  const event = new Event()

  event.setType(type)
  event.setTs(new Timestamp([now]))
  const content = event.getContentMap()
  // content.set('message', 'Test message')

  return event
}

module.exports = {
  createEvent,
}
