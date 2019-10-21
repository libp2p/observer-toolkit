'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const encryptionList = new EnumWithFrequency([
  // TODO: get some realistic values for this
  [0, 'some-encryption', 50],
  [1, 'other-encryption', 50],
])

module.exports = { encryptionList }
