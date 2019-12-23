import React, { useState } from 'react'
import styled from 'styled-components'

import { RootNodeProvider } from '@libp2p-observer/sdk'
import { ControlPanel } from '@libp2p-observer/shell'

import approvedWidgets from '../definitions/approvedWidgets'
import CatalogueItem from '../components/CatalogueItem'
import HeaderTabs from '../components/HeaderTabs'

const HEADER_HEIGHT = '62px'

const Container = styled.div`
  font-family: plex-sans, sans-serif;
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const Main = styled.div`
  padding: ${({ theme }) => theme.spacing([2, 1])};
  background-color: ${({ theme }) => theme.color('background', 1)};
  overflow-y: scroll;
  flex-grow: 1;
  flex-shrink: 1;
  position: relative;
`

const CatalogueBkg = styled.div`
  display: flex;
`

const Header = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  z-index: 50;
  top: 0;
  left: 0;
  width: 100%;
  min-height: ${HEADER_HEIGHT};
  background: ${({ theme }) => theme.color('contrast')};
  border-bottom: ${({ theme }) =>
    `${theme.spacing()} solid ${theme.color('primary')}`};
`

function Connected() {
  const [selected, setSelected] = useState(null)
  const selectedWidget = approvedWidgets[selected]
  const closeWidget = () => setSelected(null)

  return (
    <Container>
      <Header>
        <HeaderTabs />
      </Header>
      <Main>
        {selectedWidget && (
          <RootNodeProvider>
            <selectedWidget.Widget closeWidget={closeWidget} />
          </RootNodeProvider>
        )}
        <RootNodeProvider>
          <CatalogueBkg>
            {approvedWidgets.map(
              ({ name, description, tags, screenshot }, index) => (
                <CatalogueItem
                  key={name}
                  name={name}
                  description={description}
                  tags={tags}
                  screenshot={screenshot}
                  handleSelect={() =>
                    setSelected(index === selected ? null : index)
                  }
                  isSelected={selected === index}
                />
              )
            )}
          </CatalogueBkg>
        </RootNodeProvider>
      </Main>
      <ControlPanel />
    </Container>
  )
}

export default Connected
