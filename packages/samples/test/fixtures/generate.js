'use strict'

const { generateComplete } = require('../../mock/generate')
const { parseBuffer } = require('@libp2p-observer/data')

const initialConnCount = 6
const durationSeconds = 60

const bin = generateComplete(initialConnCount, durationSeconds)
const generatedData = parseBuffer(bin)

module.exports = {
  initialConnCount,
  durationSeconds,
  ...generatedData,
}
