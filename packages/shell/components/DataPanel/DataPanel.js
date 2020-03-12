import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import {
  RuntimeContext,
  Icon,
  PeerIdAvatar,
  PeerIdTooltip,
  PeerIdTruncated,
} from '@libp2p-observer/sdk'
import DataTypeControl from './DataTypeControl'
import { DataTray } from '../DataTray'

const DataPanelItem = styled.a`
  display: block;
  font-weight: 600;
  background: none;
  border: none;
  color: ${({ theme }) => theme.color('text', 3, 0.8)};
  padding: ${({ theme }) => theme.spacing(0.5)};
  text-align: left;
  cursor: pointer;
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

const DataTrayContainer = styled.section`
  position: fixed;
  bottom: 0;
  right: 0;
  left: ${({ theme }) => 160 + theme.spacing(1, true)}px;
  z-index: 25;
  border: solid
    ${({ theme }) => `${theme.spacing()} ${theme.color('contrast', 0)}`};
  background: ${({ theme }) => theme.color('contrast', 1)};
  padding-right: ${({ theme }) => theme.spacing(8)};
`

const CloseDataTray = styled.button`
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  color: ${({ theme }) => theme.color('background', 0, 0.7)};
`

function DataPanel() {
  const [isDataTrayOpen, setIsDataTrayOpen] = useState(false)

  const runtime = useContext(RuntimeContext)

  if (!runtime) return ''
  const peerId = runtime && runtime.getPeerId()

  const openDataTray = () => setIsDataTrayOpen(true)
  const closeDataTray = () => setIsDataTrayOpen(false)

  return (
    <>
      <DataTypeControl openDataTray={openDataTray} />

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

      {isDataTrayOpen && (
        <DataTrayContainer>
          <DataTray onLoad={closeDataTray} />
          <Icon
            type="remove"
            onClick={() => setIsDataTrayOpen(false)}
            override={{ Container: CloseDataTray }}
          />
        </DataTrayContainer>
      )}
    </>
  )
}

export default DataPanel
