import React, { useCallback, useContext, useState } from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import {
  StyledButton,
  usePooledData,
  AccordionControl,
  PeerIdChip,
} from '@libp2p-observer/sdk'

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

function DhtBucketInfo({ peers }) {
  const { pooledData, poolSets } = usePooledData({
    data: peers,
    poolings: [
      { mapData: peer => peer.age },
      { mapData: peer => peer.distance },
    ],
  })

  const [peerIdListIsOpen, setPeerIdListIsOpen] = useState(false)

  console.log('pooledData', pooledData, 'poolSets', poolSets)

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
        <Placeholder />
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Incoming queries</InfoItemLabel>
        <Placeholder />
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Outgoing queries</InfoItemLabel>
        <Placeholder />
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
