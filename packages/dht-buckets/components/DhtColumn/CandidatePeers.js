import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { RootNodeContext, TimeContext, Tooltip } from '@libp2p-observer/sdk'
import { getDhtBucket, dhtStatusNames } from '@libp2p-observer/data'

import CandidatePeersTable from './CandidatePeersTable'

const Container = styled.div`
  display: block;
  background: ${({ theme }) => theme.color('background')};
  padding: ${({ theme }) => theme.spacing()};
  ${({ theme }) => theme.text('label', 'medium')}
`
// Include a help tooltip explaining what a candidate is

function CandidatePeers({ bucketNum }) {
  const rootNodeRef = useContext(RootNodeContext)
  const currentState = useContext(TimeContext)
  const bucket = getDhtBucket(bucketNum, currentState)
  const candidatePeers = bucket
    .getPeersList()
    .filter(peer => dhtStatusNames[peer.getStatus()] === 'CANDIDATE')
  const candidateCount = candidatePeers.length

  return (
    <Tooltip
      side="right"
      fixOn="no-hover"
      hang
      containerRef={rootNodeRef}
      content={<CandidatePeersTable candidatePeers={candidatePeers} />}
      override={{
        Target: Container,
      }}
    >
      {candidateCount} candidate peers
    </Tooltip>
  )
}

CandidatePeers.propTypes = {
  bucketNum: T.number.isRequired,
}

export default CandidatePeers
