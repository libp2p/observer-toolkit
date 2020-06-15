import { loadSample } from '@libp2p/observer-testing'

import {
  getSubsystems,
  getLatestState,
  getStateTime,
  getStateIndex,
} from './states'

import { getEnumByName, statusNames, roleNames, transportNames } from './enums'

const {
  data: { states },
} = loadSample()

describe('states data helpers', () => {
  it('gets states from dataset', () => {
    let index = 0
    let lastTimestamp = 0
    for (const state of states) {
      const timeIndex = getStateIndex(states, getStateTime(state))
      expect(timeIndex).toBe(index)

      const timestamp = getStateTime(state)
      expect(timestamp > lastTimestamp).toBeTruthy()
      expect(typeof timestamp).toBe('number')

      lastTimestamp = timestamp
      index++
    }
    expect(states[index - 1]).toEqual(getLatestState(states))
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
})
