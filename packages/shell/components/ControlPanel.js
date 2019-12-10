import React, { useContext } from 'react'
import styled from 'styled-components'

import { DataContext, Icon, RootNodeProvider } from '@libp2p-observer/sdk'
import Timeline from './Timeline/Timeline'
import DataTypeControl from './DataTypeControl'

const leftGutter = 72

const Container = styled.div`
  background: ${({ theme }) => theme.color('contrast', 0)};
  padding: ${({ theme }) => theme.spacing()};
  display: flex;
  width: 100%;
`

const DataPanel = styled.div`
  width: 160px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color('contrast', 1)};
`

const TimePanel = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  padding-right: ${({ theme }) => theme.spacing()};
`

const DataPanelItem = styled.button`
  display: block;
  font-weight: 600;
  background: none;
  border: none;
  color: ${({ theme }) => theme.color('text', 3, 0.8)};
  padding: ${({ theme }) => theme.spacing(0.5)};
  text-align: left;
  cursor: pointer;
  ${({ theme }) => theme.text('label', 'small')} :hover {
    background: ${({ theme }) => theme.color('contrast', 2)};
  }
  margin: 2px 0;
`

const IconContainer = styled.span`
  margin-left: ${({ theme }) => theme.spacing(0.5)};
  margin-right: ${({ theme }) => theme.spacing(0.5)};
`

function ControlPanel() {
  const dataset = useContext(DataContext)
  if (!dataset || !dataset.length) return ''

  return (
    <Container>
      <RootNodeProvider>
        <DataPanel>
          <DataTypeControl metadata={dataset.metadata} />

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
          <DataPanelItem>Peer Id:</DataPanelItem>
          <DataPanelItem>
            <IconContainer>
              <Icon type="forward" />
            </IconContainer>
            About this peer
          </DataPanelItem>
        </DataPanel>
        <TimePanel>
          <Timeline leftGutter={leftGutter} />
        </TimePanel>
      </RootNodeProvider>
    </Container>
  )
}

export default ControlPanel
