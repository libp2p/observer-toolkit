import React, { useState, useContext } from 'react'
import styled from 'styled-components'

import { UploadDataButton, SampleDataButton, SetterContext } from 'sdk'

function HeaderTabs() {
  const [selectedTab, setSelectedTab] = useState(1)
  const { dispatchDataset } = useContext(SetterContext)

  const changeTab = tabIndex => {
    dispatchDataset({ action: 'remove' })
    setSelectedTab(tabIndex)
  }

  const TabsWrapper = styled.div`
    display: flex;
    height: 100%;
    padding: ${({ theme }) => `${theme.spacing()} ${theme.spacing()} 0`};
    font-weight: 700;
  `

  const SelectedTab = styled.div`
    line-height: 1em;
    display: flex;
    align-items: center;
    width: 50%;
    margin: ${({ theme }) => `${theme.spacing()} ${theme.spacing()} 0`};
    background: ${({ theme }) => theme.color('primary', 'mid')};
    padding: ${({ theme }) => `${theme.spacing()} ${theme.spacing(2)}`};
    border-radius: 6px 6px 0 0;
  `

  const UnselectedTab = styled.div`
    line-height: 1em;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 25%;
    margin: ${({ theme }) => `${theme.spacing()} ${theme.spacing()} 0`};
    background: ${({ theme }) => theme.color('secondary', 'dark')};
    padding: ${({ theme }) => `${theme.spacing()} ${theme.spacing(2)}`};
    color: ${({ theme }) => theme.color('light', 'light')};
    border-radius: 6px 6px 0 0;
  `

  const ButtonWrapper = styled.span`
    display: inline-block;
    position: relative;
    flex-grow: 1;
    text-align: right;
  `

  const SampleDataTab =
    selectedTab === 1 ? (
      <SelectedTab>
        <label>Use sample data:</label>
        <ButtonWrapper>
          <SampleDataButton title="Apply example data sample" />
        </ButtonWrapper>
      </SelectedTab>
    ) : (
      <UnselectedTab onClick={() => changeTab(1)}>
        Use sample data
      </UnselectedTab>
    )

  const UploadDataTab =
    selectedTab === 2 ? (
      <SelectedTab>
        <label>Upload data:</label>
        <ButtonWrapper>
          <UploadDataButton title="Choose protobuf data file" />
        </ButtonWrapper>
      </SelectedTab>
    ) : (
      <UnselectedTab onClick={() => changeTab(2)}>Upload data</UnselectedTab>
    )

  const ConnectWebsocketTab =
    selectedTab === 3 ? (
      <SelectedTab>
        <label>Connect websocket:</label>
        <ButtonWrapper>
          <UploadDataButton title="Enter websocket URL" />
        </ButtonWrapper>
      </SelectedTab>
    ) : (
      <UnselectedTab onClick={() => changeTab(3)}>
        Connect websocket
      </UnselectedTab>
    )

  return (
    <TabsWrapper>
      {SampleDataTab}
      {UploadDataTab}
      {ConnectWebsocketTab}
    </TabsWrapper>
  )
}

export default HeaderTabs
