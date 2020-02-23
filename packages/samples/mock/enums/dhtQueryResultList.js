'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const dhtStatusList = new EnumWithFrequency([
  [0, 'SUCCESS', 80],
  [1, 'ERROR', 10],
  [2, 'TIMEOUT', 10],
  [3, 'PENDING', 0], // Not necessarily necessary
])

module.exports = { dhtStatusList }
