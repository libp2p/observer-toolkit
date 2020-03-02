import React, { useCallback, useContext, useState } from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import {
  usePooledData,
  AccordionControl,
  Histogram,
  PeerIdChip,
  StyledButton,
  TimeContext,
} from '@libp2p-observer/sdk'
import { getStateTimes } from '@libp2p-observer/data'

import { DhtQueryContext } from './context/DhtQueryProvider'

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
  display: inline-block;
  width: ${({ theme }) => theme.spacing(12)};
`

const AccordionButton = styled.button`
  margin: 0;
  ${({ theme }) => theme.text('body', 'medium')}
`

const Placeholder = styled.div`
  height: 70px;
  border: 1px solid ${({ theme }) => theme.color('background', 2)};
  background: ${({ theme }) => theme.color('background', 0, 0.5)};
`

function getQueries(queriesByPeerId, peerIds, direction, timeNow) {
  const queries = Object.entries(queriesByPeerId).reduce(
    (queries, [peerId, peerQueries]) => {
      if (!peerIds.includes(peerId)) return queries

      const processedQueries = peerQueries[direction].map(query => ({
        elapsed: timeNow - query.start,
        peerId: peerId,
      }))
      return [...queries, ...processedQueries]
    },
    []
  )

  return queries
}

function DhtBucketInfo({ peers }) {
  const queriesByPeerId = useContext(DhtQueryContext)
  const timepoint = useContext(TimeContext)
  const { end: timeNow } = getStateTimes(timepoint)

  const { pooledData: ageData, poolSets: ageSets } = usePooledData({
    data: peers,
    poolings: [{ mapData: peer => peer.age }],
  })

  const peerIds = peers.map(peer => peer.peerId)
  const inboundQueries = getQueries(
    queriesByPeerId,
    peerIds,
    'INBOUND',
    timeNow
  )
  const outboundQueries = getQueries(
    queriesByPeerId,
    peerIds,
    'OUTBOUND',
    timeNow
  )

  const { pooledData: inboundData, poolSets: inboundSets } = usePooledData({
    data: inboundQueries,
    poolings: [{ mapData: query => query.elapsed }],
  })

  const { pooledData: outboundData, poolSets: outboundSets } = usePooledData({
    data: outboundQueries,
    poolings: [{ mapData: query => query.elapsed }],
  })

  const [peerIdListIsOpen, setPeerIdListIsOpen] = useState(false)

  return (
    <InfoList>
      <InfoItem>
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
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Peers by age</InfoItemLabel>
        <Placeholder>
          <Histogram
            pooledData={ageData}
            poolSets={ageSets}
            unit={'s'}
            verticalLines={4}
          />
        </Placeholder>
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Incoming queries</InfoItemLabel>
        <Placeholder>
          <Histogram
            pooledData={inboundData}
            poolSets={inboundSets}
            unit={'s'}
            verticalLines={4}
          />
        </Placeholder>
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Outgoing queries</InfoItemLabel>
        <Placeholder>
          <Histogram
            pooledData={outboundData}
            poolSets={outboundSets}
            unit={'s'}
            verticalLines={4}
          />
        </Placeholder>
      </InfoItem>
    </InfoList>
  )
}

DhtBucketInfo.propTypes = {
  inboundQueries: T.array.isRequired,
  outboundQueries: T.array.isRequired,
  age: T.number.isRequired,
  peerId: T.string.isRequired,
  status: T.string.isRequired,
}

export default DhtBucketInfo
