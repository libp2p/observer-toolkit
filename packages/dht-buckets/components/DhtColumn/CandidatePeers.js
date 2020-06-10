import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { RootNodeContext, TimeContext, Tooltip } from '@nearform/observer-sdk'
import { getDhtBucket, dhtStatusNames } from '@nearform/observer-data'

import PeersTable from './PeersTable'

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
    .map(peer => ({
      peerId: peer.getPeerId(),
      age: peer.getAgeInBucket(),
    }))
  const candidateCount = candidatePeers.length

  return (
    <Tooltip
      side="right"
      fixOn="no-hover"
      hang
      containerRef={rootNodeRef}
      content={<PeersTable peers={candidatePeers} />}
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
