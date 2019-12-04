'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const multiplexerList = new EnumWithFrequency([
  // TODO: get some realistic values for this
  [0, 'some-multiplexer', 50],
  [1, 'other-multiplexer', 50],
])

module.exports = { multiplexerList }
