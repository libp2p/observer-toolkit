import React, { useContext } from 'react'
import T from 'prop-types'

import { getAllDhtBuckets, getTime } from '@libp2p-observer/data'
import { DataContext, TimeContext } from '@libp2p-observer/sdk'
import DhtActivePeers from './DhtActivePeers'

function DhtBuckets({ children }) {
  const states = useContext(DataContext)
  const currentState = useContext(TimeContext)
  const timestamp = getTime(currentState)

  console.log(states)
  window.data = states

  const buckets = getAllDhtBuckets(currentState)
  const { [0]: catchAllBucketPeers, ...numberedBucketPeers } = buckets

  window.buckets = buckets
  window.catchAllBucketPeers = catchAllBucketPeers
  window.numberedBucketPeers = numberedBucketPeers
  return (
    <DhtActivePeers
      catchAllBucketPeers={catchAllBucketPeers}
      numberedBucketPeers={numberedBucketPeers}
      timestamp={timestamp}
    />
  )
}

DhtBuckets.propTypes = {
  children: T.node,
}

export default DhtBuckets
