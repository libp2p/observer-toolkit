'use strict'

const {
  random,
  randomNormalDistribution,
  generateHashId,
  mapArray,
} = require('../utils')
const { generateEvent } = require('./events')
const { dhtStatusList } = require('../enums/dhtStatusList')
const { dhtQueryDirectionList } = require('../enums/dhtQueryDirectionList')
const { dhtQueryResultList } = require('../enums/dhtQueryResultList')
const { dhtQueryTriggerList } = require('../enums/dhtQueryTriggerList')
const { dhtQueryTypeList } = require('../enums/dhtQueryTypeList')

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
  const duration = utcTo - utcFrom
  if (!duration)
    throw new Error(
      `Invalid snapshot duration of ${duration} ms (from ${utcFrom} to ${utcTo})`
    )
  return Math.round(utcFrom + random() * duration)
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

function createQuery({
  utcTo,
  utcFrom,
  direction,
  peerIds,
  queryId = generateHashId(),
  targetPeerId = generateHashId(),
  totalTimeMs = randomQueryTime(),
  totalSteps = randomQueryTotalSteps(),
  trigger = dhtQueryTriggerList.getRandom(1),
  type = dhtQueryTypeList.getRandom(1),
  result = dhtQueryResultList.getRandom(1),
  sentTs = randomQuerySentTime(utcTo, utcFrom),
  isLiveWebsocket = false,
  version = null,
} = {}) {
  const queryJSON = {
    direction: dhtQueryDirectionList.getItem(direction),
    peerIds,
    queryId,
    targetPeerId,
    totalTimeMs,
    totalSteps,
    trigger,
    type,
    result,
  }

  const eventPacket = generateEvent({
    now: sentTs,
    type: getEventType(direction),
    content: queryJSON,
  })

  return isLiveWebsocket
    ? {
        ts: sentTs,
        type: 'event',
        data: Buffer.concat([version, eventPacket]).toString('binary'),
        event: eventPacket,
      }
    : eventPacket
}

function getEventType(type) {
  switch (dhtQueryDirectionList.getItem(type)) {
    case 'INBOUND':
      return 'InboundDHTQuery'
    case 'OUTBOUND':
      return 'OutboundDHTQuery'
    default:
      throw new Error(`Unrecognised event type ${type}`)
  }
}

function createInboundQuery(activeDhtPeers, { ownPeerId, ...props }) {
  const targetsThisPeer = random() <= THIS_PEER_PROBABILITY
  const peerIds = targetsThisPeer
    ? [...createQueryPeerIds(), randomDhtPeerId(activeDhtPeers)]
    : randomPeerIdsIncludingOwn(activeDhtPeers, ownPeerId)

  return createQuery({
    targetPeerId: targetsThisPeer ? ownPeerId : generateHashId(),
    direction: dhtQueryDirectionList.getNum('INBOUND'),
    peerIds,
    ...props,
  })
}

function createOutboundQuery(activeDhtPeers, { ownPeerId, ...props }) {
  const fromThisPeer = random() <= THIS_PEER_PROBABILITY
  const peerIds = fromThisPeer
    ? [randomDhtPeerId(activeDhtPeers), ...createQueryPeerIds()]
    : randomPeerIdsIncludingOwn(activeDhtPeers, ownPeerId)

  return createQuery({
    direction: dhtQueryDirectionList.getNum('OUTBOUND'),
    peerIds,
    ...props,
  })
}

function createQueries({ dht, ...props }) {
  const peers = dht
    .getBucketsList()
    .reduce((peers, bucket) => [...peers, ...bucket.getPeersList()], [])
  const activeDhtPeers = peers.filter(
    peer => peer.getStatus() === dhtStatusList.getNum('ACTIVE')
  )
  const queryCount = randomQueryCount(activeDhtPeers.length)

  const createRandomQuery = () =>
    dhtQueryDirectionList.getRandom(1) === 'INBOUND'
      ? createInboundQuery(activeDhtPeers, props)
      : createOutboundQuery(activeDhtPeers, props)

  return Array(queryCount)
    .fill()
    .map(createRandomQuery)
}

module.exports = {
  createQueries,
}
