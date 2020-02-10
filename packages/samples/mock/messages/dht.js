'use strict'

// const { argv } = require('yargs')
const { random, randomNormalDistribution, generateHashId } = require('../utils')
const { protocolList } = require('../enums/protocolList')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')
const {
  proto: { DHT },
} = require('@libp2p-observer/proto')

const PEER_ADD_REMOVE_PROBABILITY = 1 / 40

function mapArray(size, map) {
  // create a new array of predefined size and fill with values from map function
  return Array.apply(null, Array(size)).map(map)
}

function randomQueryResult() {
  const results = [
    DHT.Query.Result.SUCCESS,
    DHT.Query.Result.ERROR,
    DHT.Query.Result.TIMEOUT,
    DHT.Query.Result.PENDING,
  ]
  const idx = Math.round(
    randomNormalDistribution({
      min: 0,
      max: 3,
      skew: 1.5,
    })
  )
  return results[idx]
}

function randomQueryTrigger() {
  const results = [DHT.Query.Trigger.API, DHT.Query.Trigger.DISCOVERY]
  const i = Math.floor(Math.random() * results.length)
  return results[i]
}

function randomQueryTime() {
  return Math.round(
    randomNormalDistribution({
      min: 5,
      max: 100,
      skew: 1.5,
    })
  )
}

function randomQueryTotalSteps() {
  return Math.round(
    randomNormalDistribution({
      min: 1,
      max: 10,
      skew: 1.5,
    })
  )
}

function randomQueryType() {
  const results = [
    DHT.Query.Type.CONTENT,
    DHT.Query.Type.PROVIDER,
    DHT.Query.Type.VALUE,
  ]
  const i = Math.floor(Math.random() * results.length)
  return results[i]
}

function randomPeerAddRemove(multiplier = 1) {
  return random() <= PEER_ADD_REMOVE_PROBABILITY * multiplier
}

function createPeerIds({ peerCount = 5 } = {}) {
  return mapArray(peerCount, generateHashId)
}

function createQuery({
  queryId = generateHashId(),
  targetPeerId = generateHashId(),
  totalTimeMs = randomQueryTime(),
  totalSteps = randomQueryTotalSteps(),
  trigger = randomQueryTrigger(),
  type = randomQueryType(),
  result = randomQueryResult(),
} = {}) {
  const query = new DHT.Query()
  query.setId(queryId)
  query.setTargetPeerId(targetPeerId)
  query.setTotalTimeMs(totalTimeMs)
  query.setTotalSteps(totalSteps)

  const peerIds = createPeerIds()
  query.setPeerIdsList(peerIds)

  query.setTrigger(trigger)
  query.setType(type)
  query.setResult(result)
  query.setSentTs(new Timestamp(Date.now()))
  return query
}

function createQueries({ queryCount = 10 } = {}) {
  return mapArray(queryCount, createQuery)
}

<<<<<<< HEAD
function createDHT({
  k = 20,
  proto = protocolList.getRandom(),
  enabled = true,
  startTs = Date.now(),
  alpha = 3,
  disjointPaths = 10,
} = {}) {
=======
function createDHT({ k = 20 } = {}) {
>>>>>>> add dht query randomness
  const dht = new DHT()
  dht.setProtocol(proto)
  dht.setEnabled(enabled)
  dht.setStartTs(new Timestamp(startTs))

  const params = new DHT.Params()
  params.setK(k)
  params.setAlpha(alpha)
  params.setDisjointPaths(disjointPaths)
  dht.setParams(params)
  const queries = createQueries()
  dht.setQueryList(queries)

  return dht
}

function updatePeerIds(peerIds) {
  peerIds.forEach((item, idx, arr) => {
    arr.splice(idx, Number(randomPeerAddRemove()))
  })
  if (randomPeerAddRemove()) {
    peerIds.push(generateHashId())
  }
}

function updateQuery(query) {
  const peerIds = query.getPeerIdsList()
  updatePeerIds(peerIds)
  query.setPeerIdsList(peerIds)
}

function updateQueries(queries) {
  queries.forEach(q => updateQuery(q))
}

function updateDHT(dht, now) {
  const queries = dht.getQueryList()
  updateQueries(queries)
  dht.setQueryList(queries)
}

module.exports = {
  createDHT,
  updateDHT,
}
