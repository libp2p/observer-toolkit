'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const protocolList = new EnumWithFrequency([
  // TODO: get some realistic values for this
  [0, 'some-protocol', 50],
  [1, 'other-protocol', 50],
])

module.exports = { protocolList }
