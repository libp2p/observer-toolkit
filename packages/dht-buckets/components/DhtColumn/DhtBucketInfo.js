import React, { useCallback, useContext, useMemo, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  usePooledData,
  AccordionControl,
  Histogram,
  PeerIdChip,
  RootNodeContext,
  SetterContext,
  TimeContext,
  Tooltip,
} from '@nearform/observer-sdk'
import { getStateTimes } from '@nearform/observer-data'

import { DhtQueryContext } from '../context/DhtQueryProvider'
import { getQueryTimesByPeer } from '../../utils/queries'
import PeersTable from './PeersTable'

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

const ShowPeers = styled.div`
  cursor: pointer;
  position: relative;
  display: block;
  padding: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.color('background')};
  margin: 0;
  ${({ theme }) => theme.text('body', 'medium')}
`

const ChartContainer = styled.div``

function DhtBucketInfo({ peers }) {
  const { queriesByPeerId, poolSetsElapsed, poolSetsAge } =
    useContext(DhtQueryContext) || {}
  const state = useContext(TimeContext)
  const { setPeerIds } = useContext(SetterContext)
  const rootNodeRef = useContext(RootNodeContext)
  const { end: timeNow } = getStateTimes(state)

  const { pooledData: ageData, poolSets: ageSets } = usePooledData({
    data: peers,
    poolings: [{ mapData: peer => peer.age / 1000 }],
    poolSets: poolSetsAge,
  })

  const { inboundQueries, outboundQueries } = useMemo(() => {
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
    return { inboundQueries, outboundQueries }
  }, [timeNow, peers, queriesByPeerId])

  const { pooledData: inboundData, poolSets: inboundSets } = usePooledData({
    data: inboundQueries,
    poolings: [{ mapData: query => query.elapsed / 1000 }],
    poolSets: poolSetsElapsed,
  })

  const { pooledData: outboundData, poolSets: outboundSets } = usePooledData({
    data: outboundQueries,
    poolings: [{ mapData: query => query.elapsed / 1000 }],
    poolSets: poolSetsElapsed,
  })

  const [peerIdListIsOpen, setPeerIdListIsOpen] = useState(false)

  const handleBarHighlight = useCallback(
    items => {
      if (!items) {
        setPeerIds([])
        return
      }
      setPeerIds(items.map(item => item.peerId))
    },
    [setPeerIds]
  )

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
            <Tooltip
              side="right"
              fixOn="no-hover"
              hang={4}
              containerRef={rootNodeRef}
              content={<PeersTable peers={peers} />}
              override={{
                Target: ShowPeers,
              }}
            >
              Show {peers.length} peer IDs
            </Tooltip>
          </>
        )}
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Incoming queries by recency</InfoItemLabel>
        <ChartContainer>
          <Histogram
            pooledData={inboundData}
            poolSets={inboundSets}
            xAxisSuffix={' secs ago'}
            verticalLines={3}
            onHighlight={handleBarHighlight}
          />
        </ChartContainer>
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Outgoing queries by recency</InfoItemLabel>
        <ChartContainer>
          <Histogram
            pooledData={outboundData}
            poolSets={outboundSets}
            xAxisSuffix={' secs ago'}
            verticalLines={3}
            onHighlight={handleBarHighlight}
          />
        </ChartContainer>
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Peers by time in bucket</InfoItemLabel>
        <ChartContainer>
          <Histogram
            pooledData={ageData}
            poolSets={ageSets}
            xAxisSuffix={' seconds'}
            verticalLines={3}
            onHighlight={handleBarHighlight}
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
