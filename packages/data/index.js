'use strict'

const { deserializeBinary } = require('@libp2p-observer/proto')

const enums = require('./lib/enums')
const helpers = require('./lib/helpers')

module.exports = {
  deserializeBinary,
  ...enums,
  ...helpers,
}
