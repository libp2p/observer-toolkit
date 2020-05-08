import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  usePooledData,
  AccordionControl,
  Histogram,
  PeerIdChip,
  TimeContext,
} from '@libp2p/observer-sdk'
import { getStateTimes } from '@libp2p/observer-data'

import { DhtQueryContext } from '../context/DhtQueryProvider'

import { getQueryTimesByPeer } from '../../utils/queries'

const InfoList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  width: 145px;
`

const InfoItem = styled.li`
  padding: ${({ theme }) => theme.spacing([0.5, 0])};
`

const PeerListItem = styled.li`
  padding: ${({ theme }) => theme.spacing([0.5, 1])};
  background: ${({ theme }) => theme.color('background', 0)};
  ${({ theme }) => theme.text('body', 'medium')}
`

const InfoItemLabel = styled.label`
  ${({ theme }) => theme.text('label', 'small')}
  text-transform: uppercase;
  color: ${({ theme }) => theme.color('tertiary', 2)};
`

const AccordionButton = styled.button`
  margin: 0;
  ${({ theme }) => theme.text('body', 'medium')}
`

const ChartContainer = styled.div``

function DhtBucketInfo({ peers }) {
  const { queriesByPeerId, poolSetsElapsed, poolSetsAge } =
    useContext(DhtQueryContext) || {}
  const timepoint = useContext(TimeContext)
  const { end: timeNow } = getStateTimes(timepoint)

  const { pooledData: ageData, poolSets: ageSets } = usePooledData({
    data: peers,
    poolings: [{ mapData: peer => peer.age }],
    poolSets: poolSetsAge,
  })

  const peerIds = peers.map(peer => peer.peerId)
  const inboundQueries = getQueryTimesByPeer({
    queriesByPeerId,
    peerIds,
    direction: 'INBOUND',
    timeNow,
  })
  const outboundQueries = getQueryTimesByPeer({
    queriesByPeerId,
    peerIds,
    direction: 'OUTBOUND',
    timeNow,
  })

  const { pooledData: inboundData, poolSets: inboundSets } = usePooledData({
    data: inboundQueries,
    poolings: [{ mapData: query => query.elapsed }],
    poolSets: poolSetsElapsed,
  })

  const { pooledData: outboundData, poolSets: outboundSets } = usePooledData({
    data: outboundQueries,
    poolings: [{ mapData: query => query.elapsed }],
    poolSets: poolSetsElapsed,
  })

  const [peerIdListIsOpen, setPeerIdListIsOpen] = useState(false)

  return (
    <InfoList>
      <InfoItem>
        {peers.length === 1 ? (
          <>
            <InfoItemLabel>Peer ID</InfoItemLabel>
            <InfoList>
              <PeerListItem key={peers[0].peerId}>
                <PeerIdChip peerId={peers[0].peerId} />
              </PeerListItem>
            </InfoList>
          </>
        ) : (
          <>
            <InfoItemLabel>Peer IDs</InfoItemLabel>
            <AccordionControl
              isOpen={peerIdListIsOpen}
              setIsOpen={setPeerIdListIsOpen}
              override={{
                AccordionButton,
              }}
            >
              Show {peers.length} peer IDs
            </AccordionControl>
            {peerIdListIsOpen && (
              <InfoList>
                {peers.map(peer => (
                  <PeerListItem key={peer.peerId}>
                    <PeerIdChip peerId={peer.peerId} />
                  </PeerListItem>
                ))}
              </InfoList>
            )}
          </>
        )}
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Incoming queries by recency</InfoItemLabel>
        <ChartContainer>
          <Histogram
            pooledData={inboundData}
            poolSets={inboundSets}
            xAxisSuffix={'ms ago'}
            verticalLines={3}
          />
        </ChartContainer>
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Outgoing queries by recency</InfoItemLabel>
        <ChartContainer>
          <Histogram
            pooledData={outboundData}
            poolSets={outboundSets}
            xAxisSuffix={'ms ago'}
            verticalLines={3}
          />
        </ChartContainer>
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Peers by time in bucket</InfoItemLabel>
        <ChartContainer>
          <Histogram
            pooledData={ageData}
            poolSets={ageSets}
            xAxisSuffix={'ms'}
            verticalLines={3}
          />
        </ChartContainer>
      </InfoItem>
    </InfoList>
  )
}

DhtBucketInfo.propTypes = {
  peers: T.array.isRequired,
}

export default DhtBucketInfo
