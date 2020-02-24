'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const dhtQueryDirectionList = new EnumWithFrequency([
  [0, 'INBOUND', 50],
  [1, 'OUTBOUND', 50],
])

module.exports = { dhtQueryDirectionList }
