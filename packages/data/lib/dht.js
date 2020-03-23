'use strict'

const { getEnumByName, dhtStatusNames, dhtQueryEventNames } = require('./enums')

const { getStateTimes } = require('./states')

const maxBucketNum = 255

// Convenience functions for extracting DHT (Distributed Hash Tables) data from states
const presentStatuses = [
  getEnumByName('ACTIVE', dhtStatusNames),
  getEnumByName('MISSING', dhtStatusNames),
]
function peerPresentInBucket(peer) {
  const status = peer.getStatus()
  return presentStatuses.includes(status)
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
  const peers = getAllDhtBuckets(state).reduce(
    (peers, bucket) => [...peers, ...bucket.getPeersList()],
    []
  )
  if (!status) return peers

  if (status === 'present') return peers.filter(peerPresentInBucket)

  const statusNum = getEnumByName(status, dhtStatusNames)
  return peers.filter(peer => peer.getStatus() === statusNum)
}

function getAllDhtBuckets(state) {
  return getDht(state).getBucketsList()
}

function getDhtBucket(bucketNum, state) {
  return getAllDhtBuckets(state).find(
    bucket => bucket.getDistance() === bucketNum
  )
}

function getDhtPeersInBucket(bucket, state) {
  if (typeof bucket === 'number') {
    return getDhtPeersInBucket(getDhtBucket(bucket, state), state)
  }
  if (!bucket) return []

  return bucket.getPeersList().filter(peerPresentInBucket)
}

function getDhtQueries(events, { state, ...options } = {}) {
  if (state) {
    // If a state is passed as an option, get queries from its time interval
    const { start, end } = getStateTimes(state)

    return getDhtQueries(events, {
      // If an explicit from or to timestamp has been passed, use that
      fromTs: options.fromTs || start,
      toTs: options.toTs || end,
      ...options,
    })
  }

  const queries = events.reduce((queries, event) => {
    // Filter to only query events
    if (!Object.values(dhtQueryEventNames).includes(event.getType()))
      return queries

    const sentTs = event.getTs()

    // Optional filters by time
    if (options.fromTs && sentTs < options.fromTs) return queries
    if (options.toTs && sentTs > options.toTs) return queries

    const content = getDhtQueryEventContent(event)
    // Optional filter by direction
    if (options.direction && content.direction !== options.direction)
      return queries

    // Optional filter by result
    if (options.result && content.result !== options.result) return queries

    // Map filtered array to only event's JSON content
    return [...queries, content]
  }, [])

  return queries
}

function getDhtQueryEventContent(event) {
  const json = JSON.parse(event.getContent())
  return {
    sentTs: Number(event.getTs()),
    direction: event.getType().match(/inbound/i) ? 'INBOUND' : 'OUTBOUND',
    ...json,
  }
}

function getDhtQueryTimes(dhtQuery) {
  // TODO: like getStateTimes, check .getSeconds() still gives ms timestamps with real data
  const start = dhtQuery.sentTs
  const duration = dhtQuery.totalTimeMs
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
  getDhtPeersInBucket,
  getAllDhtBuckets,
  getDhtQueryTimes,
  getKademliaDistance,
}
