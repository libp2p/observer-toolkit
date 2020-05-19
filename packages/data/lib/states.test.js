import { loadSample } from '@libp2p-observer/testing'

import {
  getSubsystems,
  getLatestTimepoint,
  getStateTimes,
  getTime,
  getTimeIndex,
} from './states'

import { getEnumByName, statusNames, roleNames, transportNames } from './enums'

const {
  data: { states },
} = loadSample()

describe('states data helpers', () => {
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

  it('gets subsystems from states', () => {
    expect(getSubsystems(null)).toBe(null)

    for (const state of states) {
      const subsystems = getSubsystems(state)
      expect(typeof subsystems.getConnectionsList).toBe('function')
    }
  })

  it('state timestamps follow defined sample interval', () => {
    let previousTime = null
    for (const state of states) {
      const { start, end, duration } = getStateTimes(state)

      expect(start + duration).toBe(end + 1)
      if (previousTime !== null) {
        expect(previousTime).toBe(start - 1)

        // Note: mock data can be made to be perfectly contiguous like this
        // but real libp2p introspector data may have random gaps between states
        expect(previousTime + duration).toBe(end)
      }
      previousTime = end
    }
  })
})
