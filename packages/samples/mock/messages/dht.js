'use strict'

const {
  random,
  generateHashId,
  DEFAULT_PEERS,
  HOST_PEER_ID,
  mapArray,
  createTimestamp,
} = require('../utils')
const { protocolList } = require('../enums/protocolList')
const { dhtStatusList } = require('../enums/dhtStatusList')
const { statusList } = require('../enums/statusList')
const { createQueries } = require('./dht-queries')
const {
  proto: { DHT },
} = require('@libp2p/observer-proto')
const { getKademliaDistance } = require('@libp2p/observer-data')

const PEER_ADD_REMOVE_PROBABILITY = 1 / 40

function randomPeerAddRemove(divider = 1) {
  return random() <= PEER_ADD_REMOVE_PROBABILITY / divider
}

function getCurrentBucketPeers(bucket) {
  const inBucketStatuses = ['ACTIVE', 'MISSING']
  return bucket
    .getPeersList()
    .filter(peer =>
      inBucketStatuses.includes(dhtStatusList.getItem(peer.getStatus()))
    )
}

function removePeerFromBucket(peer, bucket) {
  const peerId = peer.getPeerId()
  const peerList = bucket.getPeersList()
  const peerIndex = peerList.findIndex(_peer => _peer.getPeerId() === peerId)

  if (peerIndex < 0) {
    throw new Error(
      `Delete failed: bucket ${bucket.getCpl()} does not contain peer ${peerId}`
    )
  }

  peerList.splice(peerIndex, 1)
  bucket.setPeersList(peerList)
  return peerList
}

function createPeerInDHT({
  peerId = generateHashId(),
  bucketAge = 0,
  status = DHT.PeerInDHT.Status.ACTIVE,
} = {}) {
  const pdht = new DHT.PeerInDHT()
  pdht.setPeerId(peerId)
  pdht.setAgeInBucket(bucketAge)
  pdht.setStatus(status)
  return pdht
}

function getActiveConnectionPeerIds(connections) {
  const activeConnections = connections.filter(
    conn => conn.getStatus() === statusList.getNum('ACTIVE')
  )
  return activeConnections.map(conn => conn.getPeerId())
}

function createPeersInDHT({ peerIds = [], peersCount = DEFAULT_PEERS } = {}) {
  const dhtOnlyPeerIds = mapArray(
    Math.max(0, peersCount - peerIds.length),
    generateHashId
  )

  const targets = [...peerIds, ...dhtOnlyPeerIds]
  return targets.map(peerId => createPeerInDHT({ peerId }))
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
  connections = [],
} = {}) {
  const dht = new DHT()
  dht.setProtocol(proto)
  dht.setEnabled(enabled)
  dht.setStartTs(createTimestamp(startTs))

  // Start with just the "catch-all" zero-distance bucket then unfold as needed
  const bucketZero = new DHT.Bucket()
  bucketZero.setCpl(0)

  const peersList = createPeersInDHT({ peerIds, peersCount, connections })
  bucketZero.setPeersList(peersList)
  dht.addBuckets(bucketZero)

  const params = new DHT.Params()
  params.setK(k)
  params.setAlpha(alpha)
  params.setDisjointPaths(disjointPaths)
  dht.setParams(params)

  return dht
}

function updatePeerInDHT(peer, connection, duration) {
  updatePeerStatus(peer, connection)
  if (peer.getStatus() === dhtStatusList.getNum('ACTIVE')) {
    updatePeerInDHTBucket(peer, duration)
  }
}

function updatePeerInDHTBucket(peer, duration) {
  const age = peer.getAgeInBucket()
  peer.setAgeInBucket(age + duration)
}

function updatePeersInDHT(peers, connections, dht, duration) {
  const activeConnPeerIds = getActiveConnectionPeerIds(connections)

  peers.forEach(dhtPeer => {
    const connection = connections.find(
      conn => conn.getPeerId() === dhtPeer.getPeerId()
    )
    updatePeerInDHT(dhtPeer, connection, duration)
  })

  // If any active connection peer IDs aren't found in DHT, add peers for them
  activeConnPeerIds.forEach(peerId => {
    if (!peers.find(peer => peer.getPeerId() === peerId)) {
      const newPeer = createPeerInDHT({ peerId })
      dht.getBucketsList()[0].addPeers(newPeer)
    }
  })
}

function updateDHT({
  dht,
  connections,
  utcFrom,
  utcTo,
  msgQueue,
  msgBuffers,
  version,
  pushEvents,
}) {
  const peers = dht
    .getBucketsList()
    .reduce((peers, bucket) => [...peers, ...bucket.getPeersList()], [])

  const duration = utcTo - utcFrom

  updatePeersInDHT(peers, connections, dht, duration)

  validateBucketSizes(dht)

  const isLiveWebsocket = !!msgQueue
  const msgTarget = isLiveWebsocket ? msgQueue : msgBuffers
  const queries = createQueries({
    dht,
    utcFrom,
    utcTo,
    isLiveWebsocket,
    version,
  })

  if (!isLiveWebsocket || pushEvents) {
    queries.forEach(event => msgTarget.push(event))
  }
}

function validateBucketSizes(dht, buckets = dht.getBucketsList()) {
  const k = dht.getParams().getK()

  const overflowingBuckets = buckets.filter(
    bucket => getCurrentBucketPeers(bucket).length > k
  )

  overflowingBuckets.forEach(bucket => fixOverflowingBucket(bucket, dht))
}

function fixOverflowingBucket(bucket, dht) {
  const k = dht.getParams().getK()

  while (getCurrentBucketPeers(bucket).length > k) {
    const peersInBucket = getCurrentBucketPeers(bucket)
    const randomPeerIndex = Math.floor(random() * peersInBucket.length)
    const randomPeer = peersInBucket[randomPeerIndex]

    if (bucket.getCpl() === 0) {
      // Move from 'catch-all' bucket to allocated bucket by distance
      const distance =
        getKademliaDistance(randomPeer.getPeerId(), HOST_PEER_ID) || 1

      const newBucket = getOrCreateBucket(dht, distance)

      removePeerFromBucket(randomPeer, bucket)
      newBucket.addPeers(randomPeer)

      // Fix newBucket if it now overflows
      validateBucketSizes(dht, [newBucket])
    } else {
      ejectPeer(randomPeer)
    }
  }
}

function getOrCreateBucket(dht, distance) {
  const existingBucket = dht
    .getBucketsList()
    .find(bucket => bucket.getCpl() === distance)

  return existingBucket || dht.addBuckets(new DHT.Bucket([distance]))
}

function ejectPeer(peer) {
  peer.setStatus(dhtStatusList.getNum('CANDIDATE'))
}

function updatePeerStatus(peer, connection) {
  // If this corresponds to a connection, mimic its status
  if (connection) {
    setPeerStatusByConnection(peer, connection)
    return
  }

  // If not, it can randomly toggle missing or un-missing, or, be disconnected
  const peerStatusName = dhtStatusList.getItem(peer.getStatus())
  if (peerStatusName !== 'ACTIVE' && peerStatusName !== 'MISSING') return

  if (randomPeerAddRemove()) {
    peer.setStatus(
      dhtStatusList.getNum(peerStatusName === 'ACTIVE' ? 'MISSING' : 'ACTIVE')
    )
  } else if (randomPeerAddRemove(30)) {
    peer.setStatus(dhtStatusList.getNum('REJECTED'))
  }
}

function setPeerStatusByConnection(peer, connection) {
  const connStatusName = statusList.getItem(connection.getStatus())
  const connectionIsActive =
    connStatusName === 'ACTIVE' || connStatusName === 'OPENING'
  const peerStatusName = connectionIsActive ? 'ACTIVE' : 'MISSING'
  peer.setStatus(dhtStatusList.getNum(peerStatusName))
}

module.exports = {
  createDHT,
  updateDHT,
}
