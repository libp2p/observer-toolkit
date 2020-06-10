import React, { createContext, useContext, useMemo } from 'react'
import T from 'prop-types'

import { getStateTimes, getDhtPeers } from '@nearform/observer-data'
import {
  usePooledData,
  ConfigContext,
  TimeContext,
} from '@nearform/observer-sdk'

import useDhtQueries from '../../hooks/useDhtQueries'
import { getQueryTimesByPeer } from '../../utils/queries'

const DhtQueryContext = createContext()

function getPoolsCount(config) {
  // Auto-calculate pools count if no config is missing or was sent incomplete by server
  if (!config) return undefined
  const retentionPeriodMs = config.getRetentionPeriodMs() || 10000
  const stateSnapshotIntervalMs = config.getStateSnapshotIntervalMs() || 1000
  if (!retentionPeriodMs || !stateSnapshotIntervalMs) return undefined

  return Math.min(15, Math.ceil(retentionPeriodMs / stateSnapshotIntervalMs))
}

function DhtQueryProvider({ children }) {
  const currentState = useContext(TimeContext)
  const queriesByPeerId = useDhtQueries()
  const config = useContext(ConfigContext)

  const { allQueryTimes, peers } = useMemo(() => {
    const timeNow = getStateTimes(currentState).end
    const allQueryTimes = getQueryTimesByPeer({
      queriesByPeerId,
      timeNow,
    })
    const peers = getDhtPeers(currentState, 'present')

    return { allQueryTimes, peers }
  }, [currentState, queriesByPeerId])

  const { elapsedPoolings, agePoolings } = useMemo(() => {
    const poolsCount = getPoolsCount(config)
    const min = 0
    const max = (config && config.getRetentionPeriodMs() / 1000) || undefined
    const elapsedPoolings = [
      { mapData: query => query.elapsed / 1000, min, max, poolsCount },
    ]
    const agePoolings = [
      { mapData: peer => peer.getAgeInBucket() / 1000, min, max, poolsCount },
    ]

    return { elapsedPoolings, agePoolings }
  }, [config])

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
