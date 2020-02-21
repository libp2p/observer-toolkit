import { proto } from '@libp2p-observer/proto'
import { loadSample } from '@libp2p-observer/testing'

import {
  getDhtQueries,
  getDhtPeers,
  getDhtBucket,
  getAllDhtBuckets,
  getDhtStatus,
  getDhtQueryTimes,
} from './dht'

import { getStateTimes } from './states'

import { getConnections } from './connectionsList'

import {
  dhtQueryDirectionNames,
  dhtQueryResultNames,
  dhtStatusNames,
  getEnumByName,
  roleNames,
  statusNames,
  transportNames,
} from './enums'

const { states } = loadSample()
const sortByPeerId = (a, b) => a.getPeerId() - b.getPeerId()

function peerIdSet(peersArray) {
  return new Set(peersArray.map(peer => peer.getPeerId()))
}

function getClassProps(instance) {
  // To use for class matching of protobuf classes instead of toBeInstanceOf
  // They can't be matched with instanceof because they lack a name property
  return Object.keys(Object.getPrototypeOf(instance).constructor)
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
})
