import React, { createContext, useContext } from 'react'
import T from 'prop-types'

import { getTime, getDhtPeers } from '@nearform/observer-data'
import { usePooledData, TimeContext } from '@nearform/observer-sdk'

import useDhtQueries from '../../hooks/useDhtQueries'
import { getQueryTimesByPeer } from '../../utils/queries'

const DhtQueryContext = createContext()

function DhtQueryProvider({ children }) {
  const currentState = useContext(TimeContext)
  const timeNow = getTime(currentState)

  const queriesByPeerId = useDhtQueries()

  const allQueryTimes = getQueryTimesByPeer({
    queriesByPeerId,
    timeNow,
  })

  const peers = getDhtPeers(currentState, 'present')

  const { poolSets: poolSetsElapsed } = usePooledData({
    data: allQueryTimes,
    poolings: [{ mapData: query => query.elapsed }],
  })

  const { poolSets: poolSetsAge } = usePooledData({
    data: peers,
    poolings: [{ mapData: peer => peer.getAgeInBucket() }],
  })

  return (
    <DhtQueryContext.Provider
      value={{
        queriesByPeerId,
        poolSetsElapsed,
        poolSetsAge,
      }}
    >
      {children}
    </DhtQueryContext.Provider>
  )
}

DhtQueryProvider.propTypes = {
  children: T.node,
}

export { DhtQueryContext, DhtQueryProvider }
