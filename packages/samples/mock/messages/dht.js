'use strict'

// const { argv } = require('yargs')
const { random, randomNormalDistribution, generateHashId } = require('../utils')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')
const {
  proto: { DHT },
} = require('@libp2p-observer/proto')

const PEER_ADD_REMOVE_PROBABILITY = 1 / 40

function mapArray(size, map) {
  // create a new array of predefined size and fill with values from map function
  return Array.apply(null, Array(size)).map(map)
}

function randomQueryTime() {
  return Math.round(
    randomNormalDistribution({
      min: 1,
      max: 1e9,
      skew: 10,
    })
  )
}

function randomTotalSteps() {
  return Math.round(
    randomNormalDistribution({
      min: 1,
      max: 10,
      skew: 1.5,
    })
  )
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
  totalSteps = randomTotalSteps(),
} = {}) {
  const query = new DHT.Query()
  query.setId(queryId)
  query.setTargetPeerId(targetPeerId)
  query.setTotalTimeMs(totalTimeMs)
  query.setTotalSteps(totalSteps)

  const peerIds = createPeerIds()
  query.setPeerIdsList(peerIds)

  query.setTrigger(DHT.Query.Trigger.API)
  query.setType(DHT.Query.Type.CONTENT)
  query.setResult(DHT.Query.Result.SUCCESS)
  query.setSentTs(new Timestamp(Date.now()))
  return query
}

function createQueries({ queryCount = 10 } = {}) {
  return mapArray(queryCount, createQuery)
}

function createDHT({ k = 20, queryCount = 10 } = {}) {
  const dht = new DHT()
  // dht.setProtocol(string)
  // dht.setEnabled(bool)
  // dht.setStartTs(ts)

  const params = new DHT.Params()
  params.setK(k)
  // params.setAlpha
  // params.setDisjointPaths
  dht.setParams(params)
  const queries = createQueries()
  dht.setQueryList(queries)

  return dht
}

function updatePeerIds(peerIds) {
  peerIds.forEach(peerId => {
    if (randomPeerAddRemove()) {
      peerId = null
    }
  })
  peerIds.shift()
  peerIds.push(generateHashId())
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
