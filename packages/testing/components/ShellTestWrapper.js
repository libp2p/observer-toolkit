import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { RootNodeProvider } from '@libp2p-observer/sdk'
import { ControlPanel } from '@libp2p-observer/shell'

import DataTestWrapper from './DataTestWrapper'

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
function ShellTestWrapper({ children }) {
  return (
    <DataTestWrapper>
      <Page>
        <Content>
          <RootNodeProvider>
            <div data-testid="widget">{children}</div>
          </RootNodeProvider>
        </Content>
        <div data-testid="shell">
          <ControlPanel />
        </div>
      </Page>
    </DataTestWrapper>
  )
}

ShellTestWrapper.propTypes = {
  children: T.node,
}

export default ShellTestWrapper
