'use strict'

// const { argv } = require('yargs')
const {
  random,
  randomNormalDistribution,
  generateHashId,
  DEFAULT_PEERS,
} = require('../utils')
const { protocolList } = require('../enums/protocolList')
const { dhtStatusList, presentInBuckets } = require('../enums/dhtStatusList')
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb')
const {
  proto: { DHT },
} = require('@libp2p-observer/proto')

const BUCKET_MOVE_PROBABILITY = 1 / 50
const PEER_ADD_REMOVE_PROBABILITY = 1 / 40
const MAX_BUCKETS = 256

function mapArray(size, map) {
  // create a new array of predefined size and fill with values from map function
  return Array.apply(null, Array(size)).map(map)
}

function randomBucketMove(multiplier = 1) {
  const move = random() <= BUCKET_MOVE_PROBABILITY * multiplier
  return move ? Math.floor(Math.random() * 3) - 1 : 0
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

function createPeerIds({ peersCount = DEFAULT_PEERS } = {}) {
  return mapArray(peersCount, generateHashId)
}

function createPeerInDHT({
  peerId = generateHashId(),
  bucket = 0,
  bucketAge = 0,
  status = DHT.PeerInDHT.Status.ACTIVE,
} = {}) {
  const pdht = new DHT.PeerInDHT()
  pdht.setPeerId(peerId)
  pdht.setBucket(bucket)
  pdht.setAgeInBucket(bucketAge)
  pdht.setStatus(status)
  return pdht
}

function createPeersInDHT({ peerIds = [], peersCount = DEFAULT_PEERS } = {}) {
  const targets = peerIds.length
    ? peerIds
    : mapArray(peersCount, generateHashId)
  return targets.map(peerId => createPeerInDHT({ peerId }))
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

function createQueries({ peerIds = [], queryCount = 10 } = {}) {
  const targets = peerIds.length
    ? peerIds
    : mapArray(queryCount, generateHashId)
  return targets.map(targetPeerId => createQuery({ targetPeerId }))
}

function createDHT({
  k = 20,
  proto = protocolList.getRandom(),
  enabled = true,
  startTs = Date.now(),
  alpha = 3,
  disjointPaths = 10,
  peerIds = [],
  peersCount = DEFAULT_PEERS,
} = {}) {
  const dht = new DHT()
  dht.setProtocol(proto)
  dht.setEnabled(enabled)
  dht.setStartTs(new Timestamp(startTs))

  const params = new DHT.Params()
  params.setK(k)
  params.setAlpha(alpha)
  params.setDisjointPaths(disjointPaths)
  dht.setParams(params)
  const queries = createQueries({ peerIds })
  dht.setQueryList(queries)
  const peers = createPeersInDHT({ peersCount })
  dht.setPeerInDhtList(peers)

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

function updatePeerInDHT(peer) {
  updatePeerInDHTBucket(peer)
  // peer.setStatus(status)
}

function updatePeerInDHTBucket(peer) {
  const move = randomBucketMove()
  const oldBucket = peer.getBucket()
  const newBucket = Math.min(Math.max(0, oldBucket + move), MAX_BUCKETS - 1)
  if (newBucket !== oldBucket) {
    peer.setBucket(newBucket)
    peer.setAgeInBucket(0)
  } else {
    const age = peer.getAgeInBucket()
    peer.setAgeInBucket(age + 1000)
  }
}

function updatePeersInDHT(peers) {
  peers.forEach(p => updatePeerInDHT(p))
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

  const peers = dht.getPeerInDhtList()
  updatePeersInDHT(peers)
  dht.setPeerInDhtList(peers)

  validateBucketSizes(dht)

  // Helpful for debugging bucket allocation:
  /*
  console.log(
    'Peer bucket allocation:',
    dht.getPeerInDhtList().length,
    dht.getPeerInDhtList().reduce((oldBuckets, peer) => {
      const newBuckets = { ...oldBuckets }
      const bucketIndex = peer.getBucket()
      if (typeof bucketIndex === 'number') {
        if (typeof newBuckets[bucketIndex] === 'number') {
          newBuckets[bucketIndex] += 1
        } else {
          newBuckets[bucketIndex] = 1
        }
      }
      return newBuckets
    }, {})
  )
  */
}

function validateBucketSizes(
  dht,
  bucketIndexes = [...Array(MAX_BUCKETS).keys()]
) {
  const peers = dht.getPeerInDhtList()
  const k = dht.getParams().getK()

  const buckets = bucketIndexes.map(index => ({
    peers: peers.filter(
      peer => presentInBuckets(peer.getStatus()) && peer.getBucket() === index
    ),
    index,
  }))

  const overflowingBuckets = buckets.filter(({ peers }) => peers.length > k)

  overflowingBuckets.forEach(({ peers, index }) =>
    fixOverflowingBucket(peers, index, dht)
  )
}

function fixOverflowingBucket(peersInBucket, bucketIndex, dht) {
  const k = dht.getParams().getK()
  const movedPeers = []

  while (peersInBucket.length > k) {
    const randomPeerIndex = Math.floor(random() * peersInBucket.length)
    const randomPeer = peersInBucket[randomPeerIndex]

    if (bucketIndex === 0) {
      // Move from 'catch-all' bucket to allocated bucket
      // In real LibP2P, is based on bitwise XOR i.e. kademlia distance of peer Id
      // We'll use random bucket, favouring higher numbers (= more similar XOR)
      const weightedRand = Math.max(Math.pow(random(), 1 / 10), 1 / MAX_BUCKETS)
      const allocatedBucket = Math.ceil(weightedRand * (MAX_BUCKETS - 1))

      randomPeer.setBucket(allocatedBucket)

      validateBucketSizes(dht, [allocatedBucket])
    } else {
      ejectPeer(randomPeer)
    }

    const [movedPeer] = peersInBucket.splice(randomPeerIndex, 1)
    movedPeers.push(movedPeer)
  }
}

function ejectPeer(peer) {
  peer.setStatus(dhtStatusList.getNum('EJECTED'))
}

module.exports = {
  createDHT,
  updateDHT,
}
