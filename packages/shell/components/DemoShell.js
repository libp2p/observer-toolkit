import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  DataProvider,
  ThemeSetter,
  applySampleData,
} from '@libp2p-observer/sdk'
import Timeline from '../components/Timeline/Timeline'

const Page = styled.div`
  display: flex;
  position: fixed;
  flex-direction: column;
  height: 100%;
  width: 100%;
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
const Controls = styled.div`
  border-top: 2px solid ${({ theme }) => theme.color('light', 'dark')};
  height: 185px;
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: -${({ theme }) => theme.spacing()};
  padding-left: ${({ theme }) => theme.spacing()};
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

  if (!mockData && !isLoading)
    applySampleData(0, onDataLoadStart, onDataLoadComplete)

  return !mockData ? (
    'Loading sample data...'
  ) : (
    <ThemeSetter>
      <DataProvider initialData={mockData}>
        <Page>
          <Content>{children}</Content>
          <Controls>
            <Timeline />
          </Controls>
        </Page>
      </DataProvider>
    </ThemeSetter>
  )
}

DemoShell.propTypes = {
  children: T.node,
}

export default DemoShell
