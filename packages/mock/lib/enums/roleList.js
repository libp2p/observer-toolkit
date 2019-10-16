'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const roleList = new EnumWithFrequency([
  [0, 'INITIATOR', 50],
  [1, 'RESPONDER', 50],
])

module.exports = { roleList }
