import React, { useContext } from 'react'

import { DataContext, EventsContext } from '@libp2p-observer/sdk'
import { getDhtQueries } from '@libp2p-observer/data'
import { renderWithData } from '@libp2p-observer/testing'

import useDhtQueries from './useDhtQueries'

function isQueryPresent(query, queriesByPeerId) {
  return query.getPeerIdsList().some(peerId => {
    if (!queriesByPeerId[peerId]) return false

    const directionName = query.direction
    const directionalQueries = queriesByPeerId[peerId][directionName]

    return directionalQueries.some(hookQuery => {
      if (hookQuery.start !== query.sentTs) return false

      if (hookQuery.duration !== query.totalTimeMs) return false
      return true
    })
  })
}

describe('useDhtQueries hook', () => {
  it('Expected queries are present and placed correctly', () => {
    const TestInComponent = () => {
      const queriesByPeerId = useDhtQueries()
      const states = useContext(DataContext)
      const events = useContext(EventsContext)

      for (const currentState of states) {
        const queries = getDhtQueries(events, { state: currentState })

        const absentQueries = queries.filter(
          query => !isQueryPresent(query, queriesByPeerId)
        )

        // This should be 0-length; format any exceptions in human-readable way for debugging
        const absentQueriesMapped = absentQueries.map(query => {
          const peerIdMatches = query.peerIds.filter(
            peerId => !!queriesByPeerId[peerId]
          )
          return {
            peerIdMatches,
            query: {
              direction: query.direction,
              start: query.sentTs,
              duration: query.totalTimeMs,
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
