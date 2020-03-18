'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const dhtStatusList = new EnumWithFrequency([
  [0, 'ACTIVE', 60],
  [1, 'MISSING', 26],
  [2, 'DISCONNECTED', 10],
  [3, 'EJECTED', 4],
])

module.exports = { dhtStatusList }
