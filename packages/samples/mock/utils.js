'use strict'

const { createHash } = require('crypto')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')

const DEFAULT_CONNECTIONS = 6
const DEFAULT_DURATION = 10 // Seconds
const DEFAULT_FILE = `mock-${Date.now()}`
const DEFAULT_STREAMS = 10
const DEFAULT_PEERS = 30
const DEFAULT_SNAPSHOT_DURATION = 1000 // Miliseconds

const HOUR_IN_SECONDS = 3600
const SECOND_IN_MS = 1000
const GIGABYTE_IN_BYTES = 1e9

// TODO: Make this relative to a CLI arg
// Chance that any one connection or stream will open or close in one second
const OPEN_CLOSE_PROBABILITY = 1 / 40

let peerIdsGenerated = 0
function generateHashId() {
  const randomNumber = peerIdsGenerated + Math.pow(0.5 / random(), 5 / random())
  const hash = createHash('sha256')
    .update(randomNumber.toString())
    .digest('hex')

  peerIdsGenerated++
  return hash
}

function getRandomiser() {
  // Use real random numbers in real mocks, consistent ones in tests

  const isTest = !!process.env.TAP

  // The *tiny* but real chance of Math.random() returning actual 0 is an edge case we don't need
  const randomAndTruthy = () => Math.random() || randomAndTruthy()
  /* istanbul ignore if */
  if (!isTest) return randomAndTruthy

  let index = 0
  const pseudoRandom = () => {
    // Avoid flakey test failures with varied but consistent values
    index = index < 39 ? index + 1 : 1
    const decimal = (index / 4) * 0.1
    // 0.025, 0.95, 0.075, 0.9, 0.125, 0.85...
    return index % 2 ? decimal : 1 - decimal
  }
  return pseudoRandom
}
const random = getRandomiser()

// Adapted from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randomNormalDistribution({ min, max, skew }) {
  let u = random()
  let v = random()
  let num = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  num = num / 10 + 0.5

  /* istanbul ignore if : prevent unlikely cases that break the maths */
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
      skew: 6, // Mean of around 15 mbs / second per stream
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

function mapArray(size, map) {
  // create a new array of predefined size and fill with values from map function
  return Array.apply(null, Array(size)).map(map)
}

function createTimestamp(utcNum) {
  return new Timestamp([Math.round(utcNum)])
}

// Create a new random hash each time script is run
const HOST_PEER_ID = generateHashId()

module.exports = {
  DEFAULT_CONNECTIONS,
  DEFAULT_DURATION,
  DEFAULT_FILE,
  DEFAULT_STREAMS,
  DEFAULT_PEERS,
  DEFAULT_SNAPSHOT_DURATION,
  HOUR_IN_SECONDS,
  SECOND_IN_MS,
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
  generateHashId,
  mapArray,
  createTimestamp,
}
