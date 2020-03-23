'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const dhtStatusList = new EnumWithFrequency([
  [0, 'ACTIVE', 60],
  [1, 'MISSING', 26],
  [2, 'REJECTED', 10],
  [3, 'CANDIDATE', 4],
])

module.exports = { dhtStatusList }
