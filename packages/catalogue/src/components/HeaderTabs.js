import React, { useState } from 'react'
import styled from 'styled-components'

import { UploadData } from 'sdk'

function HeaderTabs() {
  const [selectedTab, setSelectedTab] = useState(1)

  const TabsWrapper = styled.div`
    display: flex;
    height: 100%;
    padding: ${({ theme }) => `${theme.spacing()} ${theme.spacing()} 0`};
    font-weight: 700;
    line-height: 1em;
  `

  const SelectedTab = styled.div`
    display: flex;
    align-items: center;
    width: 50%;
    margin: ${({ theme }) => `${theme.spacing()} ${theme.spacing()} 0`};
    background: ${({ theme }) => theme.color('primary', 'mid')};
    padding: ${({ theme }) => theme.spacing()};
  `

  const UnselectedTab = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 25%;
    margin: ${({ theme }) => `${theme.spacing()} ${theme.spacing()} 0`};
    background: ${({ theme }) => theme.color('secondary', 'dark')};
    padding: ${({ theme }) => theme.spacing()};
    color: ${({ theme }) => theme.color('light', 'light')};
  `

  const Tab1 =
    selectedTab === 1 ? (
      <SelectedTab>
        <label>Upload data:</label>
        <UploadData />
      </SelectedTab>
    ) : (
      <UnselectedTab onClick={() => setSelectedTab(1)}>
        Upload data
      </UnselectedTab>
    )

  const Tab2 =
    selectedTab === 2 ? (
      <SelectedTab>
        <label>Connect websocket:</label>
        <UploadData />
      </SelectedTab>
    ) : (
      <UnselectedTab onClick={() => setSelectedTab(2)}>
        Connect websocket
      </UnselectedTab>
    )

  const Tab3 =
    selectedTab === 3 ? (
      <SelectedTab>
        <label>Use sample data:</label>
        <UploadData />
      </SelectedTab>
    ) : (
      <UnselectedTab onClick={() => setSelectedTab(3)}>
        Use sample data
      </UnselectedTab>
    )

  return (
    <TabsWrapper>
      {Tab1}
      {Tab2}
      {Tab3}
    </TabsWrapper>
  )
}

export default HeaderTabs
