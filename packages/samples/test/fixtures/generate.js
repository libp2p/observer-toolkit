'use strict'

const { generateComplete } = require('../../mock/generate')
const { parseBuffer } = require('@libp2p-observer/data')

const initialConnCount = 6
const durationSeconds = 40
const durationSnapshot = 1000
const peersCount = 500 // Enough to overflow bucket 0 and other buckets

const bin = generateComplete(
  initialConnCount,
  durationSeconds,
  peersCount,
  durationSnapshot
)
const generatedData = parseBuffer(bin)

module.exports = {
  initialConnCount,
  durationSeconds,
  durationSnapshot,
  ...generatedData,
}
