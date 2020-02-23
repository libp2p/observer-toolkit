'use strict'

const {
  random,
  randomNormalDistribution,
  generateHashId,
  mapArray,
} = require('../utils')
const { protocolList } = require('../enums/protocolList')
const { dhtStatusList, presentInBuckets } = require('../enums/dhtStatusList')
const { dhtQueryDirectionList } = require('../enums/dhtQueryDirectionList')

const { statusList } = require('../enums/statusList')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')
const {
  proto: { DHT },
} = require('@libp2p-observer/proto')

const INBOUND_PROBABILITY = 1 / 2
const THIS_PEER_PROBABILITY = 1 / 10

function randomQueryPeersCount() {
  return Math.round(
    randomNormalDistribution({
      min: 1,
      max: 20,
      skew: 1.5,
    })
  )
}

function randomQueryCount(activePeerCount) {
  const num = Math.round(
    randomNormalDistribution({
      min: 0,
      max: activePeerCount * 3,
      skew: 1,
    })
  )

  // █
  // █   ██
  // █ ██████
  // ████████████
  // █████████████████████████
  // 0--------------------------------------
  return Math.max(0, num - activePeerCount - 2)
}

function randomQuerySentTime(utcTo, utcFrom) {
  const interval = utcTo - utcFrom
  return utcFrom + random() * interval
}

function randomPeerIdsIncludingOwn(activeDhtPeers, ownPeerId) {
  return [
    ...createQueryPeerIds(Math.max(0, randomQueryPeersCount() - 1) / 2),
    randomDhtPeerId(activeDhtPeers),
    ownPeerId,
    randomDhtPeerId(activeDhtPeers),
    ...createQueryPeerIds(Math.max(0, randomQueryPeersCount() - 1) / 2),
  ]
}

function randomDhtPeerId(activeDhtPeers) {
  const peerIndex = Math.floor(activeDhtPeers.length * random())
  return activeDhtPeers[peerIndex].getPeerId()
}

function createQueryPeerIds({ peersCount = randomQueryPeersCount() } = {}) {
  return mapArray(Math.round(peersCount), generateHashId)
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
  direction,
  peerIds,
  utcTo,
  utcFrom,
  queryId = generateHashId(),
  targetPeerId = generateHashId(),
  totalTimeMs = randomQueryTime(),
  totalSteps = randomQueryTotalSteps(),
  trigger = randomQueryTrigger(),
  type = randomQueryType(),
  result = randomQueryResult(),
  sentTs,
} = {}) {
  const query = new DHT.Query()
  query.setId(queryId)
  query.setDirection(direction)
  query.setTargetPeerId(targetPeerId)
  query.setTotalTimeMs(totalTimeMs)
  query.setTotalSteps(totalSteps)
  query.setPeerIdsList(peerIds)

  query.setTrigger(trigger)
  query.setType(type)
  query.setResult(result)

  const randomTs = randomQuerySentTime(utcTo, utcFrom)

  query.setSentTs(new Timestamp([sentTs || randomTs]))
  return query
}

function createInboundQuery(activeDhtPeers, { ownPeerId, utcTo, utcFrom }) {
  const targetsThisPeer = random() <= THIS_PEER_PROBABILITY
  const peerIds = targetsThisPeer
    ? [...createQueryPeerIds(), randomDhtPeerId(activeDhtPeers)]
    : randomPeerIdsIncludingOwn(activeDhtPeers, ownPeerId)

  return createQuery({
    targetPeerId: targetsThisPeer ? ownPeerId : generateHashId(),
    direction: dhtQueryDirectionList.getNum('INBOUND'),
    peerIds,
    utcTo,
    utcFrom,
  })
}

function createOutboundQuery(activeDhtPeers, { ownPeerId, utcTo, utcFrom }) {
  const fromThisPeer = random() <= THIS_PEER_PROBABILITY
  const peerIds = fromThisPeer
    ? [randomDhtPeerId(activeDhtPeers), ...createQueryPeerIds()]
    : randomPeerIdsIncludingOwn(activeDhtPeers, ownPeerId)

  return createQuery({
    direction: dhtQueryDirectionList.getNum('OUTBOUND'),
    peerIds,
    utcTo,
    utcFrom,
  })
}

function createQueries({ dht, ...props }) {
  const activeDhtPeers = dht
    .getPeerInDhtList()
    .filter(peer => peer.getStatus() === dhtStatusList.getNum('ACTIVE'))
  const queryCount = randomQueryCount(activeDhtPeers.length)

  const createRandomQuery = () =>
    random() <= INBOUND_PROBABILITY
      ? createInboundQuery(activeDhtPeers, props)
      : createOutboundQuery(activeDhtPeers, props)
  return Array(queryCount)
    .fill()
    .map(createRandomQuery)
}

module.exports = {
  createQueries,
  // Might need an 'updateQueries' fn if "pending" status is confirmed and needs mocking
}
