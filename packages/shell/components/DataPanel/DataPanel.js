import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import {
  RuntimeContext,
  SetterContext,
  Icon,
  PeerIdAvatar,
  PeerIdTooltip,
  PeerIdTruncated,
  Tooltip,
} from '@libp2p/observer-sdk'
import DataTypeControl from './DataTypeControl'
import FileDownload from './FileDownload'
import GlobalFilterControl from './GlobalFilterControl'
import RuntimeInfo from './RuntimeInfo'
import { DataTray } from '../DataTray'

const DataPanelItem = styled.span`
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
  const { globalFilters } = useContext(SetterContext)

  const peerId = runtime && runtime.getPeerId()

  const activeFilters = globalFilters.filter(filter => filter.enabled)
  const pluralFilters = activeFilters.length !== 1

  const openDataTray = () => setIsDataTrayOpen(true)
  const closeDataTray = () => setIsDataTrayOpen(false)

  return (
    <>
      <DataTypeControl openDataTray={openDataTray} />

      <Tooltip fixOn={'no-hover'} content={<GlobalFilterControl />}>
        <DataPanelItem>
          <IconContainer>
            <Icon type="filter" active={!!activeFilters.length} />
          </IconContainer>
          {activeFilters.length} filter{pluralFilters && 's'} applied
        </DataPanelItem>
      </Tooltip>
      <Tooltip fixOn={'no-hover'} content={<FileDownload />}>
        <DataPanelItem>
          <IconContainer>
            <Icon type="doc" />
          </IconContainer>
          Export data
        </DataPanelItem>
      </Tooltip>
      {peerId ? (
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
      ) : (
        <DataPanelItem>
          <IconContainer>
            <Icon type="marker" />
          </IconContainer>
          Peer id — Not connected
        </DataPanelItem>
      )}
      <Tooltip fixOn={'no-hover'} content={<RuntimeInfo />}>
        <DataPanelItem>
          <IconContainer>
            <Icon type="forward" />
          </IconContainer>
          About this peer
        </DataPanelItem>
      </Tooltip>

      {isDataTrayOpen && (
        <DataTrayContainer>
          <DataTray handleNewData={closeDataTray} />
          <Icon
            type="remove"
            onClick={closeDataTray}
            override={{ Container: CloseDataTray }}
          />
        </DataTrayContainer>
      )}
    </>
  )
}

export default DataPanel
