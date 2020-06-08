import React, { createContext, useContext, useMemo } from 'react'
import T from 'prop-types'

import { getStateTimes, getDhtPeers } from '@nearform/observer-data'
import { usePooledData, TimeContext } from '@nearform/observer-sdk'

import useDhtQueries from '../../hooks/useDhtQueries'
import { getQueryTimesByPeer } from '../../utils/queries'

const DhtQueryContext = createContext()

const elapsedPoolings = [{ mapData: query => query.elapsed }]
const agePoolings = [{ mapData: peer => peer.getAgeInBucket() }]

function DhtQueryProvider({ children }) {
  const currentState = useContext(TimeContext)
  const queriesByPeerId = useDhtQueries()

  const { allQueryTimes, peers } = useMemo(() => {
    const timeNow = getStateTimes(currentState).end
    const allQueryTimes = getQueryTimesByPeer({
      queriesByPeerId,
      timeNow,
    })
    const peers = getDhtPeers(currentState, 'present')
    return { allQueryTimes, peers }
  }, [currentState, queriesByPeerId])

  const { poolSets: poolSetsElapsed } = usePooledData({
    data: allQueryTimes,
    poolings: elapsedPoolings,
  })

  const { poolSets: poolSetsAge } = usePooledData({
    data: peers,
    poolings: agePoolings,
  })

  const contextValue = useMemo(
    () => ({
      queriesByPeerId,
      poolSetsElapsed,
      poolSetsAge,
    }),
    [queriesByPeerId, poolSetsElapsed, poolSetsAge]
  )

  return (
    <DhtQueryContext.Provider value={contextValue}>
      {children}
    </DhtQueryContext.Provider>
  )
}

DhtQueryProvider.propTypes = {
  children: T.node,
}

export { DhtQueryContext, DhtQueryProvider }
