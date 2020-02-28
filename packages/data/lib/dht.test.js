import { loadSample } from '@libp2p-observer/testing'

import {
  getDhtQueries,
  getDhtPeers,
  getDhtBucket,
  getAllDhtBuckets,
  getDhtStatus,
  getKademliaDistance,
} from './dht'

import {
  dhtQueryDirectionNames,
  dhtQueryResultNames,
  dhtStatusNames,
  getEnumByName,
} from './enums'

const {
  data: { states },
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
    let currentBucketNum = 0
    const maxBucketNum = 255

    // Invalid bucket => no array
    expect(() => getDhtBucket(maxBucketNum + 1, states[0])).toThrow()

    const allBuckets = getAllDhtBuckets(states[0])

    // Every peer should appear exactly once
    while (currentBucketNum <= maxBucketNum) {
      const peersInBucket = getDhtBucket(currentBucketNum, states[0])

      if (peersInBucket.length) {
        expect(peerIdSet(allBuckets[currentBucketNum])).toEqual(
          peerIdSet(peersInBucket)
        )
      } else {
        expect(allBuckets[currentBucketNum]).toBeFalsy()
      }

      currentBucketNum++
    }
    const presentPeers = getDhtPeers(states[0], 'present')

    const allPeersInBuckets = Object.values(
      allBuckets
    ).reduce((peers, bucketPeers) => [...peers, ...bucketPeers])

    expect(peerIdSet(allPeersInBuckets)).toEqual(peerIdSet(presentPeers))
  })

  it('gets current DHT queries with optional filters', () => {
    for (const state of states) {
      const allQueries = getDhtQueries(state)
      const inboundSuccessQueries = getDhtQueries(state, {
        result: 'SUCCESS',
        direction: 'INBOUND',
      })

      expect(allQueries.length).toBeGreaterThanOrEqual(
        inboundSuccessQueries.length
      )

      const resultsAndDirections = inboundSuccessQueries.map(query => ({
        result: query.getResult(),
        direction: query.getDirection(),
      }))

      expect(
        resultsAndDirections.filter(
          ({ result }) =>
            result !== getEnumByName('SUCCESS', dhtQueryResultNames)
        )
      ).toHaveLength(0)

      expect(
        resultsAndDirections.filter(
          ({ direction }) =>
            direction !== getEnumByName('INBOUND', dhtQueryDirectionNames)
        )
      ).toHaveLength(0)
    }
  })

  it('Calculates Kademlia distance correctly', () => {
    const string64 = end => 'a'.repeat(64 - end.length) + end

    const aaa64 = string64('')

    expect(getKademliaDistance(aaa64, string64('b'))).toBe(255)

    expect(getKademliaDistance(aaa64, string64('bb'))).toBe(251)

    expect(getKademliaDistance(aaa64, string64('bbb'))).toBe(247)

    expect(getKademliaDistance(aaa64, string64('b'.repeat(61)))).toBe(15)

    expect(getKademliaDistance(aaa64, string64('b'.repeat(62)))).toBe(11)

    expect(getKademliaDistance(aaa64, string64('b'.repeat(63)))).toBe(7)
  })
})
