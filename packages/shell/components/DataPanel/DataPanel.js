import React, { useContext } from 'react'
import styled from 'styled-components'
import T from 'prop-types'

import {
  RuntimeContext,
  Icon,
  PeerIdAvatar,
  PeerIdTooltip,
  PeerIdTruncated,
} from '@libp2p-observer/sdk'
import DataTypeControl from './DataTypeControl'

const DataPanelItem = styled.button`
  display: block;
  font-weight: 600;
  background: none;
  border: none;
  color: ${({ theme }) => theme.color('text', 3, 0.8)};
  padding: ${({ theme }) => theme.spacing(0.5)};
  text-align: left;
  cursor: pointer;
  margin: 2px 0;
  ${({ theme }) => theme.text('label', 'small')} :focus {
    outline: none;
  }
  :hover {
    background: ${({ theme }) => theme.color('contrast', 2)};
  }
  ${({ theme, isFixed }) =>
    isFixed &&
    `
    background: ${theme.color('contrast', 2, 0.5)};
    ${theme.boxShadow({ opacity: 0.4 })}
  `}
`

const IconContainer = styled.span`
  margin-left: ${({ theme }) => theme.spacing(0.5)};
  margin-right: ${({ theme }) => theme.spacing(0.5)};
`

function DataPanel({ metadata = {} }) {
  const runtime = useContext(RuntimeContext)
  const peerId = runtime.getPeerId()

  return (
    <>
      <DataTypeControl metadata={metadata} />

      <DataPanelItem>
        <IconContainer>
          <Icon type="filter" />
        </IconContainer>
        0 filters applied
      </DataPanelItem>
      <DataPanelItem>
        <IconContainer>
          <Icon type="doc" />
        </IconContainer>
        Export data
      </DataPanelItem>
      <PeerIdTooltip peerId={peerId} override={{ Target: DataPanelItem }}>
        <IconContainer>
          <Icon type="marker" />
        </IconContainer>
        Peer id —
        <IconContainer>
          <PeerIdAvatar peerId={peerId} />
        </IconContainer>
        <PeerIdTruncated peerId={peerId} />
      </PeerIdTooltip>
      <DataPanelItem>
        <IconContainer>
          <Icon type="forward" />
        </IconContainer>
        About this peer
      </DataPanelItem>
    </>
  )
}

DataPanel.propTypes = {
  metadata: T.object,
}

export default DataPanel
