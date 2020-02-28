'use strict'

const {
  proto: { Event },
} = require('@libp2p-observer/proto')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')

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

module.exports = {
  createEvent,
}
