import React, { useContext } from 'react'

import { DataContext } from '@libp2p-observer/sdk'
import { dhtQueryDirectionNames, getDhtQueries } from '@libp2p-observer/data'
import { renderWithData } from '@libp2p-observer/testing'

import useDhtQueries from './useDhtQueries'

const getDirectionName = query => dhtQueryDirectionNames[query.getDirection()]

function isQueryPresent(query, queriesByPeerId) {
  return query.getPeerIdsList().some(peerId => {
    if (!queriesByPeerId[peerId]) return false

    const directionName = getDirectionName(query)
    const directionalQueries = queriesByPeerId[peerId][directionName]

    return directionalQueries.some(hookQuery => {
      if (hookQuery.start !== query.getSentTs().getSeconds()) return false

      if (hookQuery.duration !== query.getTotalTimeMs()) return false
      return true
    })
  })
}

describe('useDhtQueries hook', () => {
  it('Expected queries are present and placed correctly', () => {
    const TestInComponent = () => {
      const queriesByPeerId = useDhtQueries()
      const states = useContext(DataContext)

      for (const currentState of states) {
        const queries = getDhtQueries(currentState)

        const absentQueries = queries.filter(
          query => !isQueryPresent(query, queriesByPeerId)
        )

        // This should be 0-length; format any exceptions in human-readable way for debugging
        const absentQueriesMapped = absentQueries.map(query => {
          const peerIdMatches = query
            .getPeerIdsList()
            .filter(peerId => !!queriesByPeerId[peerId])
          return {
            peerIdMatches,
            query: {
              direction: getDirectionName(query),
              start: query.getSentTs().getSeconds(),
              duration: query.getTotalTimeMs(),
            },
          }
        })

        expect(absentQueriesMapped).toEqual([])
      }
      return ''
    }
    renderWithData(<TestInComponent />)
  })
})
