import { useContext, useMemo } from 'react'

import {
  dhtQueryDirectionNames,
  dhtQueryResultNames,
  getDhtPeers,
  getDhtQueries,
  getDhtQueryTimes,
  getTime,
  getTimeIndex,
} from '@libp2p-observer/data'
import { DataContext, FilterContext, TimeContext } from '@libp2p-observer/sdk'

function getQueriesByPeerId(relevantStates, currentState, applyFilters) {
  const queriesByPeerId = getDhtPeers(currentState, 'present').reduce(
    (keyed, peer) => ({
      ...keyed,
      [peer.getPeerId()]: { INBOUND: [], OUTBOUND: [] },
    })
  )

  // If necessary for performance, could use useReducer and append queries from new states
  for (const state of relevantStates) {
    const queries = getDhtQueries(state)
      .map(query => ({
        direction: dhtQueryDirectionNames[query.getDirection()],
        result: dhtQueryResultNames[query.getResult()],
        peers: query.getPeerIdsList(),
        ...getDhtQueryTimes(query),
      }))
      .filter(applyFilters)

    for (const query of queries) {
      for (const peerId of query.peers) {
        const peerQueries = queriesByPeerId[peerId]
        if (peerQueries) {
          peerQueries[query.direction].push(query)
        }
      }
    }
  }

  return queriesByPeerId
}

function useDhtQueries() {
  const states = useContext(DataContext)
  const currentState = useContext(TimeContext)
  const { applyFilters } = useContext(FilterContext)

  const timestamp = getTime(currentState)
  const timeIndex = getTimeIndex(states, timestamp)

  const relevantStates = states.slice(0, timeIndex)

  const queriesByPeerId = useMemo(
    () => getQueriesByPeerId(relevantStates, currentState, applyFilters),
    [relevantStates, currentState, applyFilters]
  )

  return queriesByPeerId
}

export default useDhtQueries
