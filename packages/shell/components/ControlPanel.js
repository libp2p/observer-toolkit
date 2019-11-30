import React, { useContext } from 'react'
import styled from 'styled-components'

import { DataContext, Icon } from '@libp2p-observer/sdk'
import Timeline from './Timeline/Timeline'
import DataTypeControl from './DataTypeControl'

const leftGutter = 72

const Container = styled.div`
  background: ${({ theme }) => theme.color('contrast', 0)};
  padding: ${({ theme }) => theme.spacing()};
  position: fixed;
  bottom: 0;
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
  margin-left: ${leftGutter}px;
`

const DataPanelItem = styled.button`
  display: block;
  font-weight: 600;
  background: none;
  border: none;
  color: ${({ theme }) => theme.color('text', 2, 0.8)};
  padding: ${({ theme }) => theme.spacing(0.5)};
  text-align: left;
  cursor: pointer;
  ${({ theme }) => theme.text('label', 'small')} :hover {
    background: ${({ theme }) => theme.color('contrast', 2)};
  }
  margin: 2px 0;
`

function ControlPanel() {
  const dataset = useContext(DataContext)
  if (!dataset || !dataset.length) return ''

  return (
    <Container>
      <DataPanel>
        <DataTypeControl metadata={dataset.metadata} />

        <DataPanelItem>
          <Icon type="filter" />0 filters applied
        </DataPanelItem>
        <DataPanelItem>
          <Icon type="filter" />
          Export data
        </DataPanelItem>
        <DataPanelItem>Peer Id:</DataPanelItem>
        <DataPanelItem>
          <Icon type="filter" />
          About this peer
        </DataPanelItem>
      </DataPanel>
      <TimePanel>
        <Timeline leftGutter={leftGutter} />
      </TimePanel>
    </Container>
  )
}

export default ControlPanel
