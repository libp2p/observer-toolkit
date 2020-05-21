import { loadSample } from '@nearform/observer-testing'

import {
  getDhtQueries,
  getDhtPeers,
  getDhtBucket,
  getDhtPeersInBucket,
  getAllDhtBuckets,
  getDhtStatus,
  getKademliaDistance,
} from './dht'

import { dhtStatusNames, getEnumByName } from './enums'

import { getStateTimes } from './states'

const {
  data: { states, events },
} = loadSample()

function peerIdSet(peersArray) {
  return new Set(peersArray.map(peer => peer.getPeerId()))
}

if (!states.length)
  throw new Error('Deserialization error prevents testing helpers')

describe('DHT data helpers', () => {
  it('gets DHT status data', () => {
    const status = getDhtStatus(states[0])

    expect(typeof status.enabled).toBe('boolean')
    expect(typeof status.protocol).toBe('string')
    expect(typeof status.startTime).toBe('number')
    expect(typeof status.alpha).toBe('number')
    expect(typeof status.k).toBe('number')
  })

  it('gets current DHT peers', () => {
    for (const state of states) {
      const allPeers = getDhtPeers(state)
      const activePeers = getDhtPeers(state, 'ACTIVE')
      const presentPeers = getDhtPeers(state, 'present')
      const disconnectedPeers = getDhtPeers(state, 'DISCONNECTED')

      expect(allPeers.length).toBeGreaterThanOrEqual(activePeers.length)

      const active = getEnumByName('ACTIVE', dhtStatusNames)
      const filteredActivePeers = allPeers.filter(
        peer => peer.getStatus() === active
      )
      expect(peerIdSet(filteredActivePeers)).toEqual(peerIdSet(activePeers))

      const activeInPresent = activePeers.filter(peer =>
        presentPeers.includes(peer)
      )
      expect(peerIdSet(activePeers)).toEqual(peerIdSet(activeInPresent))

      const disconnected = getEnumByName('DISCONNECTED', dhtStatusNames)
      const filteredDisconnectedPeers = allPeers.filter(
        peer => peer.getStatus() === disconnected
      )
      expect(peerIdSet(filteredDisconnectedPeers)).toEqual(
        peerIdSet(disconnectedPeers)
      )
      const disconnectedInPresent = disconnectedPeers.filter(peer =>
        presentPeers.includes(peer)
      )
      expect(peerIdSet(disconnectedInPresent)).toEqual(peerIdSet([]))
    }
  })

  it('gets DHT peers by buckets', () => {
    const maxBucketNum = 255

    const invalidBucketNum = maxBucketNum + 1
    expect(getDhtBucket(invalidBucketNum, states[0])).toBeFalsy()

    const allBuckets = getAllDhtBuckets(states[0])
    const allPeerIdsInBuckets = new Set()
    const duplicatedPeers = []

    // Every peer should appear exactly once
    allBuckets.forEach(bucket => {
      const peersInBucket = getDhtPeersInBucket(bucket, states[0])
      peersInBucket.forEach(peer => {
        const peerId = peer.getPeerId()

        if (allPeerIdsInBuckets.has(peerId)) {
          duplicatedPeers.push({
            bucket: bucket.getCpl(),
            peerId,
          })
        }
        allPeerIdsInBuckets.add(peerId)
      })
    })
    expect(duplicatedPeers).toEqual([])

    const presentPeers = getDhtPeers(states[0], 'present')
    expect(allPeerIdsInBuckets).toEqual(peerIdSet(presentPeers))
  })

  it('gets current DHT queries with optional filters', () => {
    const allQueriesFromAllStates = getDhtQueries(events)
    const allQueriesAccumulated = new Set()
    const duplicatedQueries = []

    for (const state of states) {
      const allQueries = getDhtQueries(events, { state })
      allQueries.forEach(query => {
        if (allQueriesAccumulated.has(query)) {
          duplicatedQueries.push({
            stateTimes: getStateTimes(state),
            query,
          })
        }
        allQueriesAccumulated.add(query)
      })

      const inboundSuccessQueries = getDhtQueries(events, {
        state,
        result: 'SUCCESS',
        direction: 'INBOUND',
      })

      expect(allQueries.length).toBeGreaterThanOrEqual(
        inboundSuccessQueries.length
      )

      const resultsAndDirections = inboundSuccessQueries.map(
        ({ result, direction }) => ({
          result,
          direction,
        })
      )

      expect(
        resultsAndDirections.filter(({ result }) => result !== 'SUCCESS')
      ).toHaveLength(0)

      expect(
        resultsAndDirections.filter(({ direction }) => direction !== 'INBOUND')
      ).toHaveLength(0)
    }

    expect(allQueriesFromAllStates.length).toBeGreaterThan(0)
    expect(duplicatedQueries).toEqual([])
    expect(allQueriesAccumulated).toEqual(new Set(allQueriesFromAllStates))
  })

  it('Calculates Kademlia distance correctly', () => {
    const string64 = end => 'a'.repeat(64 - end.length) + end

    const aaa64 = string64('')

    expect(getKademliaDistance(aaa64, string64('b'))).toBe(256)

    expect(getKademliaDistance(aaa64, string64('bb'))).toBe(252)

    expect(getKademliaDistance(aaa64, string64('bbb'))).toBe(248)

    expect(getKademliaDistance(aaa64, string64('b'.repeat(61)))).toBe(16)

    expect(getKademliaDistance(aaa64, string64('b'.repeat(62)))).toBe(12)

    expect(getKademliaDistance(aaa64, string64('b'.repeat(63)))).toBe(8)

    expect(getKademliaDistance(aaa64, '0'.repeat(64))).toBe(1)
  })
})
