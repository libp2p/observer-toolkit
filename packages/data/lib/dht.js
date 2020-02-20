'use strict'

const { getSubsystems } = require('./states')
const {
  getEnumByName,
  dhtStatusNames,
  dhtQueryResultNames,
  dhtQueryDirectionNames,
} = require('./enums')

const maxBucketNum = 255

// Convenience functions for extracting DHT (Distributed Hash Tables) data from states

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
  const dht = getDht(state)
  const peers = getDht(state).getPeerInDhtList()
  if (!status) return peers

  const statusNum = getEnumByName(status, dhtStatusNames)
  return peers.filter(peer => peer.getStatus() === statusNum)
}

function getAllDhtBuckets(state) {
  const buckets = getDhtPeers(state).reduce((buckets, peer) => {
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

  return getDhtPeers(state).filter(peer => peer.getBucket() === bucketNum)
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

module.exports = {
  getDht,
  getDhtQueries,
  getDhtPeers,
  getDhtStatus,
  getDhtBucket,
  getAllDhtBuckets,
  getDhtQueryTimes,
}
