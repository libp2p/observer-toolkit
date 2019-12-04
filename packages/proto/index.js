'use strict'

const proto = require('./lib/introspection_pb')
const fnv1a = require('./lib/fnv1a')

module.exports = {
  deserializeBinary: proto.ProtocolDataPacket.deserializeBinary,
  fnv1a,
  proto,
}
