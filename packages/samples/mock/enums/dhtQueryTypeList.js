'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const dhtQueryTypeList = new EnumWithFrequency([
  [0, 'CONTENT', 50],
  [1, 'PROVIDER', 20],
  [1, 'VALUE', 30],
])

module.exports = { dhtQueryTypeList }
