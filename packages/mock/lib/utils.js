'use strict'

const DEFAULT_CONNECTIONS = 6
const DEFAULT_DURATION = 10 // Seconds
const DEFAULT_FILE = `mock-${Date.now()}`
const DEFAULT_STREAMS = 10

// This may need to become configurable, but that's not currently planned
const SNAPSHOT_DURATION = 1000 // Miliseconds

const DAY_IN_MS = 8.64e7
const GIGABYTE_IN_BYTES = 1e9

// TODO: Make this relative to a CLI arg
// Chance that any one connection or stream will open or close in one second
const OPEN_CLOSE_PROBABILITY = 1 / 40

const HOST_PEER_ID = 'peer-id-of-host'

const random = Math.random

function randomFractionOfSecond() {
  return random() * 1000
}

// Adapted from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randomNormalDistribution({ min, max, skew = 1 }) {
  let u = random()
  let v = random()
  let num = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  num = num / 10 + 0.5

  if (num > 1 || num < 0) return randomNormalDistribution(min, max, skew)

  num = Math.pow(num, skew) // higher skew => lower values
  return num * (max - min) + min
}

function randomFluctuationMultiplier() {
  return randomNormalDistribution({
    min: 0.5,
    max: 2,
    skew: 1.6, // Mean of around 1 so fluctuations don't trend up or down
  })
}

function randomLatency() {
  // TODO: get more info on expected values here
  return Math.round(
    randomNormalDistribution({
      min: 1,
      max: 1e9,
      skew: 9, // Mean around 6 ms or 6e+6 ns
    })
  )
}

function randomBandwidth() {
  return Math.round(
    randomNormalDistribution({
      min: 1,
      max: GIGABYTE_IN_BYTES,
      skew: 7, // Mean of around 15 mbs / second per stream
    })
  )
}

function randomOpenClose(multiplier = 1) {
  return random() <= OPEN_CLOSE_PROBABILITY * multiplier
}

function encodeNumToBin(num) {
  const buf = Buffer.alloc(4)
  buf.writeUIntLE(num, 0, 4)
  return buf
}

function decodeBinToNum(buf, offset = 0) {
  return buf.readUIntLE(offset, 4)
}

module.exports = {
  DEFAULT_CONNECTIONS,
  DEFAULT_DURATION,
  DEFAULT_FILE,
  DEFAULT_STREAMS,
  SNAPSHOT_DURATION,
  DAY_IN_MS,
  GIGABYTE_IN_BYTES,
  HOST_PEER_ID,
  OPEN_CLOSE_PROBABILITY,
  encodeNumToBin,
  decodeBinToNum,
  random,
  randomNormalDistribution,
  randomFluctuationMultiplier,
  randomLatency,
  randomBandwidth,
  randomOpenClose,
  randomFractionOfSecond,
}
