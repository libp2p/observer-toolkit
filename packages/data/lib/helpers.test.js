import { proto } from '@libp2p-observer/proto'
import { loadSample } from '@libp2p-observer/testing'

import {
  getAllConnections,
  getAllStreamsAtTime,
  getConnections,
  getConnectionTraffic,
  getConnectionAge,
  getEnumByName,
  getStreamAge,
  getStreamTraffic,
  getLatestTimepoint,
  getTime,
  getTimeIndex,
} from './helpers'

import { statusNames, roleNames, transportNames } from './enums'

const { Connection } = proto
const { states } = loadSample()

function getClassProps(instance) {
  // To use for class matching of protobuf classes instead of toBeInstanceOf
  // They can't be matched with instanceof because they lack a name property
  return Object.keys(Object.getPrototypeOf(instance).constructor)
}

if (!states.length)
  throw new Error('Deserialization error prevents testing helpers')

describe('data helpers', () => {
  it('gets connection data from sample protobuf file', () => {
    const allConnections = getAllConnections(states)
    expect(allConnections).toBeInstanceOf(Array)

    const allConnectionIds_1 = new Set(
      allConnections.map(connection => {
        // Check getAllConnections against getConnections to ensure it gets every connection exactly once
        expect(getClassProps(connection)).toEqual(Object.keys(Connection))
        return connection.getId().toString()
      })
    )

    const allConnectionIds_2 = new Set()

    for (const timepoint of states) {
      const connections = getConnections(timepoint)
      expect(connections).toBeInstanceOf(Array)

      expect(
        connections.length <= allConnections.length,
        'No timepoint should contain more connections than total'
      ).toBeTruthy()

      for (const connection of connections) {
        expect(getClassProps(connection)).toEqual(Object.keys(Connection))
        const id = connection.getId()

        allConnectionIds_2.add(id.toString())
      }
    }

    expect(allConnectionIds_1).toEqual(allConnectionIds_2)
    expect(
      allConnectionIds_1.size,
      'Each connection should have a unique id'
    ).toBe(allConnections.length)
  })

  it('gets stream data from sample protobuf file', () => {
    for (const timepoint of states) {
      const allStreamsWithConnection = getAllStreamsAtTime(timepoint)
      const streamIds_1 = new Set(
        allStreamsWithConnection.map(({ stream }) => stream.getId().toString())
      )

      const streamIds_2 = new Set()
      let connStreamMismatches = 0
      for (const connection of getConnections(timepoint)) {
        const streams = connection.getStreams().getStreamsList()
        for (const stream of streams) {
          streamIds_2.add(stream.getId().toString())

          const connStreamPair = allStreamsWithConnection.find(
            pair => stream.getId() === pair.stream.getId()
          )
          const pairConnId = connStreamPair.connection.getId().toString()
          if (connection.getId().toString() !== pairConnId)
            connStreamMismatches++
        }
      }

      expect(connStreamMismatches).toBe(0)
      expect(streamIds_1).toEqual(streamIds_2)
      expect(streamIds_1.size, 'Each stream should have a unique id').toBe(
        allStreamsWithConnection.length
      )
    }
  })

  it('gets traffic and age data from streams and connections', () => {
    const connections = new Set()

    const timepoint = getLatestTimepoint(states)
    const allStreamsWithConnection = getAllStreamsAtTime(timepoint)
    for (const { connection, stream } of allStreamsWithConnection) {
      // Traffic - streams
      const bytesIn = getStreamTraffic(stream, 'in', 'bytes')
      expect(typeof bytesIn).toBe('number')
      expect(bytesIn >= 0).toBeTruthy()

      const bytesOut = getStreamTraffic(stream, 'out', 'bytes')
      expect(typeof bytesOut).toBe('number')
      expect(bytesOut >= 0).toBeTruthy()

      const packetsIn = getStreamTraffic(stream, 'in', 'packets')
      expect(typeof packetsIn).toBe('number')
      expect(packetsIn >= 0).toBeTruthy()

      const packetsOut = getStreamTraffic(stream, 'out', 'packets')
      expect(typeof packetsOut).toBe('number')
      expect(packetsOut >= 0).toBeTruthy()

      // Traffic - connections
      if (!connections.has(connection)) {
        connections.add(connection)

        const bytesIn = getConnectionTraffic(connection, 'in', 'bytes')
        expect(typeof bytesIn).toBe('number')
        expect(bytesIn >= 0).toBeTruthy()

        const bytesOut = getConnectionTraffic(connection, 'out', 'bytes')
        expect(typeof bytesOut).toBe('number')
        expect(bytesOut >= 0).toBeTruthy()

        const packetsIn = getConnectionTraffic(connection, 'in', 'packets')
        expect(typeof packetsIn).toBe('number')
        expect(packetsIn >= 0).toBeTruthy()

        const packetsOut = getConnectionTraffic(connection, 'out', 'packets')
        expect(typeof packetsOut).toBe('number')
        expect(packetsOut >= 0).toBeTruthy()
      }

      // Age
      const connectionAge = getConnectionAge(connection, timepoint)
      expect(typeof connectionAge).toBe('number')
      expect(connectionAge >= 0).toBeTruthy()

      const streamAge = getStreamAge(stream, timepoint)
      expect(typeof streamAge).toBe('number')
      expect(streamAge >= 0).toBeTruthy()
    }
  })

  it('gets timepoints from dataset', () => {
    let index = 0
    let lastTimestamp = 0
    for (const timepoint of states) {
      const timeIndex = getTimeIndex(states, getTime(timepoint))
      expect(timeIndex).toBe(index)

      const timestamp = getTime(timepoint)
      expect(timestamp > lastTimestamp).toBeTruthy()
      expect(typeof timestamp).toBe('number')

      lastTimestamp = timestamp
      index++
    }
    expect(states[index - 1]).toEqual(getLatestTimepoint(states))
  }, 20000)

  it('gets valid enums only', () => {
    expect(typeof getEnumByName('ERROR', statusNames)).toBe('number')
    expect(typeof getEnumByName('RESPONDER', roleNames)).toBe('number')
    expect(typeof getEnumByName('RDP', transportNames)).toBe('number')
    expect(() => getEnumByName('missing enum name', statusNames)).toThrow()
  })
})
