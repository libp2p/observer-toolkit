'use strict'

const {
  proto: { Event },
} = require('@libp2p-observer/proto')
// const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')

// const { SNAPSHOT_DURATION } = require('../utils')
// const { createTraffic, sumTraffic } = require('../messages/traffic')

function createEvent(now) {
  const event = new Event()

//   event. .... //

  return event
}

module.exports = {
  createEvent,
}
