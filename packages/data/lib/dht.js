'use strict'

const {
  getEnumByName,
  dhtStatusNames,
  dhtQueryResultNames,
  dhtQueryDirectionNames,
} = require('./enums')

const maxBucketNum = 255

// Convenience functions for extracting DHT (Distributed Hash Tables) data from states

function peerPresentInBucket(peer) {
  const active = getEnumByName('ACTIVE', dhtStatusNames)
  const missing = getEnumByName('MISSING', dhtStatusNames)
  const status = peer.getStatus()
  return status === active || status === missing
}

function getDht(state) {
  const dht = state.getSubsystems().getDht()
  return dht
}

function getDhtStatus(state) {
  const dht = getDht(state)
  const params = dht.getParams()

  return {
    enabled: dht.getEnabled(),
    protocol: dht.getProtocol(),
    startTime: dht.getStartTs().getSeconds(),
    alpha: params.getAlpha(),
    k: params.getK(),
  }
}

function getDhtPeers(state, status = null) {
  const peers = getDht(state).getPeerInDhtList()
  if (!status) return peers

  if (status === 'present') return peers.filter(peerPresentInBucket)

  const statusNum = getEnumByName(status, dhtStatusNames)
  return peers.filter(peer => peer.getStatus() === statusNum)
}

function getAllDhtBuckets(state) {
  const buckets = getDhtPeers(state, 'present').reduce((buckets, peer) => {
    const bucketNum = peer.getBucket()
    if (typeof bucketNum !== 'number' || bucketNum > maxBucketNum)
      return buckets

    if (buckets[bucketNum]) {
      buckets[bucketNum].push(peer)
    } else {
      buckets[bucketNum] = [peer]
    }
    return buckets
  }, {})
  return buckets
}

function getDhtBucket(bucketNum, state) {
  if (bucketNum > maxBucketNum)
    throw new Error(
      `Invalid DHT bucket number (${bucketNum} > ${maxBucketNum})`
    )

  return getDhtPeers(state, 'present').filter(
    peer => peer.getBucket() === bucketNum
  )
}

function getDhtQueries(state, options) {
  const queries = getDht(state).getQueryList()
  if (!options) return queries

  return queries.filter(query => {
    if (
      options.direction &&
      query.getDirection() !==
        getEnumByName(options.direction, dhtQueryDirectionNames)
    )
      return false
    if (
      options.result &&
      query.getResult() !== getEnumByName(options.result, dhtQueryResultNames)
    )
      return false
    return true
  })
}

function getDhtQueryTimes(dhtQuery) {
  // TODO: like getStateTimes, check .getSeconds() still gives ms timestamps with real data
  const start = dhtQuery.getSentTs().getSeconds()
  const duration = dhtQuery.getTotalTimeMs()
  const end = start + duration

  return {
    start,
    end,
    duration,
  }
}

function getKademliaDistance(peerId_A, peerId_B) {
  const bufA = Buffer.from(peerId_A, 'hex')
  const bufB = Buffer.from(peerId_B, 'hex')

  // Credit @mafintosh https://github.com/mafintosh/kademlia-routing-table/blob/master/index.js
  for (let i = 0; i < bufA.length; i++) {
    const a = bufA[i]
    const b = bufB[i]

    if (a !== b) return i * 8 + Math.clz32(a ^ b) - 24 + 1
  }
  return maxBucketNum
}

module.exports = {
  getDht,
  getDhtQueries,
  getDhtPeers,
  getDhtStatus,
  getDhtBucket,
  getAllDhtBuckets,
  getDhtQueryTimes,
  getKademliaDistance,
}
