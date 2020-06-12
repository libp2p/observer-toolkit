import React, { useContext } from 'react'
import styled from 'styled-components'

import { DataContext, RootNodeProvider } from '@libp2p/observer-sdk'
import Timeline from './Timeline/Timeline'
import DataPanel from './DataPanel/DataPanel'

const leftGutter = 72

const Container = styled.div`
  background: ${({ theme }) => theme.color('contrast', 0)};
  padding: ${({ theme }) => theme.spacing()};
  display: flex;
  width: 100%;
`

const DataPanelSection = styled.div`
  width: 160px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color('contrast', 1)};
`

const TimePanelSection = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  padding-right: ${({ theme }) => theme.spacing()};
`

const EmptyTimeline = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color('background', 0, 0.5)};
  text-align: middle;
  ${({ theme }) => theme.text('heading', 'extraLarge')}
  margin: 0;
`

function ControlPanel() {
  const dataset = useContext(DataContext)

  return (
    <Container>
      <RootNodeProvider>
        <DataPanelSection>
          <DataPanel />
        </DataPanelSection>
        <TimePanelSection>
          {dataset.length > 1 ? (
            <Timeline leftGutter={leftGutter} />
          ) : (
            <EmptyTimeline>Awaiting states data...</EmptyTimeline>
          )}
        </TimePanelSection>
      </RootNodeProvider>
    </Container>
  )
}

export default ControlPanel
