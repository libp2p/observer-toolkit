'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const dhtQueryTriggerList = new EnumWithFrequency([
  [0, 'API', 80],
  [1, 'DISCOVERY', 20],
])

module.exports = { dhtQueryTriggerList }
