'use strict'

const { test } = require('tap')
const { runtime, states, events } = require('./fixtures/generate')

const {
  getConnections,
  getDhtPeers,
  getEnumByName,
  getDhtStatus,
  getAllDhtBuckets,
  getDhtPeersInBucket,
  getStateTimes,
  getDhtQueries,
  getDhtQueryTimes,
  dhtStatusNames,
} = require('@nearform/observer-data')

function abortIfFailed(failCount, i) {
  // Don't clog up console when something fails in every / many states
  // Test failures are logged in Tap output as normal
  if (failCount)
    throw new Error(
      `Aborting in state[${i}] - ${failCount} test failure${
        failCount === 1 ? '' : 's'
      } logged`
    )
}

test('Active connections are active in DHT.', t => {
  states.forEach((state, i) => {
    const peers = getDhtPeers(state)

    const connections = getConnections(state)
    const active = getEnumByName('ACTIVE', dhtStatusNames)
    const activeConns = connections
      .map(conn => ({
        status: conn.getStatus(),
        peerId: conn.getPeerId(),
      }))
      .filter(({ status }) => status === active)

    // All active connections appear in DHT somewhere
    const activeNotInDht = activeConns.filter(
      ({ peerId }) => !peers.some(peer => peer.getPeerId() === peerId)
    )
    t.strictSame(activeNotInDht, [], 'activeNotInDht should be empty')
    t.notEquals(activeConns, 0)

    abortIfFailed(t.counts.fail, i)
  })
  t.end()
})

test('Allocation of DHT peers to buckets is correct.', t => {
  states.forEach((state, i) => {
    const { k } = getDhtStatus(state)

    const allBuckets = getAllDhtBuckets(state)
    const foundPeers = new Set()

    for (const [bucketNum, bucket] of Object.entries(allBuckets)) {
      const peersInBucket = getDhtPeersInBucket(bucket)

      // Correct number of peers per bucket
      t.ok(
        peersInBucket.length <= k,
        `peersInBucket.length (${peersInBucket.length}) <= k (${k}) for bucket ${bucketNum} in state ${i}`
      )

      // Each peer is in one and only one bucket
      for (const peer of peersInBucket) {
        t.notOk(
          foundPeers.has(peer),
          `peer "${peer.getPeerId().slice(0, 6)}..." not duplicated`
        )
        foundPeers.add(peer)
      }
    }

    const bucketablePeers = [
      ...getDhtPeers(state, 'ACTIVE'),
      ...getDhtPeers(state, 'MISSING'),
    ]

    // Buckets contain, and only contain, active and missing peers
    t.strictSame(new Set(bucketablePeers), foundPeers)

    abortIfFailed(t.counts.fail, i)
  })
  t.end()
})

test('DHT query timestamps and peer IDs correspond to this state snapshot.', t => {
  let previousState = null

  states.forEach((state, i) => {
    const { start, end } = getStateTimes(state)

    const queries = getDhtQueries(events, { state })

    // Check all queries are from this state's time interval
    const invalidTimes = queries
      .map(query => getDhtQueryTimes(query))
      .filter(times => times.end < start || times.start > end)

    t.strictSame(
      invalidTimes,
      [],
      `invalidTimes should be empty at { start: ${start}, end: ${end} }`
    )

    // Check all queries involve a peer ID that is or was in the DHT at the right time
    if (previousState !== null) {
      const potentialQueryPeerIds = [
        runtime.getPeerId(),
        ...getDhtPeers(state).map(peer => peer.getPeerId()),
        ...getDhtPeers(previousState).map(peer => peer.getPeerId()),
      ]

      const peerLists = queries.map(query => query.peerIds)

      const invalidPeerLists = peerLists.filter(peerList => {
        return !potentialQueryPeerIds.some(peerId => peerList.includes(peerId))
      })
      t.strictSame(invalidPeerLists, [], 'invalidPeerLists should be empty')
    }

    previousState = state
    abortIfFailed(t.counts.fail, i)
  })
  t.end()
})
