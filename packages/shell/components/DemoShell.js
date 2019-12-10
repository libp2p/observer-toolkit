import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  DataProvider,
  ThemeSetter,
  applySampleData,
} from '@libp2p-observer/sdk'
import samples from '@libp2p-observer/samples'

import ControlPanel from '../components/ControlPanel'

const Page = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`
const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  overflow-y: scroll;
  width: calc(100% - 16px);
  padding-right: 8px;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.3);
  }
`

// Standalone shell for demoing one component e.g. for staging in Storybook
function DemoShell({ children }) {
  const [mockData, setMockData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const onDataLoadStart = () => setIsLoading(true)
  const onDataLoadComplete = data => {
    setIsLoading(false)
    setMockData(data)
  }

  if (!mockData && !isLoading) {
    applySampleData(samples[0], onDataLoadStart, onDataLoadComplete)
  }

  return !mockData ? (
    'Loading sample data...'
  ) : (
    <ThemeSetter>
      <DataProvider initialData={mockData}>
        <Page>
          <Content>{children}</Content>
          <ControlPanel />
        </Page>
      </DataProvider>
    </ThemeSetter>
  )
}

DemoShell.propTypes = {
  children: T.node,
}

export default DemoShell
