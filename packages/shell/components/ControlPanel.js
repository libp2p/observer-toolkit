import React, { useContext } from 'react'
import styled from 'styled-components'

import { DataContext, RootNodeProvider } from '@libp2p-observer/sdk'
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

function ControlPanel() {
  const dataset = useContext(DataContext)
  if (!dataset || !dataset.length) return ''

  return (
    <Container>
      <RootNodeProvider>
        <DataPanelSection>
          <DataPanel metadata={dataset.metadata} />
        </DataPanelSection>
        <TimePanelSection>
          <Timeline leftGutter={leftGutter} />
        </TimePanelSection>
      </RootNodeProvider>
    </Container>
  )
}

export default ControlPanel
