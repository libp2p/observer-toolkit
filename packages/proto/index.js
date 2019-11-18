'use strict'

const proto = require('./lib/introspection_pb')

module.exports = {
  deserializeBinary: proto.State.deserializeBinary,
  proto,
}
