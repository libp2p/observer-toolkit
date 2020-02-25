import React, { useCallback, useContext } from 'react'
import T from 'prop-types'
import styled, { withTheme } from 'styled-components'

import { PeerIdChip } from '@libp2p-observer/sdk'

const Container = styled.ul`
  padding: 0;
  list-style: none;
`

const InfoItem = styled.li`
  padding: ${({ theme }) => theme.spacing([0.5, 0])};
  white-space: nowrap;
`

const InfoItemLabel = styled.label`
  ${({ theme }) => theme.text('label', 'small')}
  text-transform: uppercase;
  color: ${({ theme }) => theme.color('tertiary', 2)};
  display: inline-block;
  width: ${({ theme }) => theme.spacing(12)};
`

function DhtPeerInfo({ peerId, age, status, inboundQueries, outboundQueries }) {
  return (
    <Container>
      <InfoItem>
        <InfoItemLabel>Peer ID</InfoItemLabel>
        <PeerIdChip peerId={peerId} />
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Status</InfoItemLabel>
        {status}
      </InfoItem>
      <InfoItem>
        <InfoItemLabel>Age</InfoItemLabel>
        {age}
      </InfoItem>
    </Container>
  )
}

DhtPeerInfo.propTypes = {
  inboundQueries: T.array.isRequired,
  outboundQueries: T.array.isRequired,
  age: T.number.isRequired,
  peerId: T.string.isRequired,
  status: T.string.isRequired,
}

export default DhtPeerInfo
