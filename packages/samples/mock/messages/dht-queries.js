'use strict'

const {
  random,
  randomNormalDistribution,
  generateHashId,
  mapArray,
} = require('../utils')
const { protocolList } = require('../enums/protocolList')
const { dhtStatusList, presentInBuckets } = require('../enums/dhtStatusList')
const { statusList } = require('../enums/statusList')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')
const {
  proto: { DHT },
} = require('@libp2p-observer/proto')

const QUERY_PEER_CHANGE_PROBABILITY = 1 / 40

function randomQueryPeerChange(multiplier = 1) {
  return random() <= QUERY_PEER_CHANGE_PROBABILITY * multiplier
}

function createQueryPeerIds({ peersCount } = {}) {
  return mapArray(peersCount, generateHashId)
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

  const peerIds = createQueryPeerIds()
  query.setPeerIdsList(peerIds)

  query.setTrigger(trigger)
  query.setType(type)
  query.setResult(result)
  query.setSentTs(new Timestamp(Date.now()))
  return query
}

function createQueries({ peerIds = [], queryCount = 10 } = {}) {
  const targets = peerIds.length
    ? peerIds
    : mapArray(queryCount, generateHashId)
  return targets.map(targetPeerId => createQuery({ targetPeerId }))
}

function updateQuery(query) {
  const peerIds = query.getPeerIdsList()
  updateQueryPeerIds(peerIds)
  query.setPeerIdsList(peerIds)
}

function updateQueries(queries) {
  queries.forEach(q => updateQuery(q))
}

function updateQueryPeerIds(peerIds) {
  peerIds.forEach((item, idx, arr) => {
    arr.splice(idx, Number(randomQueryPeerChange()))
  })
  if (randomQueryPeerChange()) {
    peerIds.push(generateHashId())
  }
}

module.exports = {
  createQueries,
  updateQueries,
}
