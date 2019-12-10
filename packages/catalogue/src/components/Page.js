import React, { useState } from 'react'
import styled from 'styled-components'

import { RootNodeProvider } from '@libp2p-observer/sdk'
import { ControlPanel } from '@libp2p-observer/shell'

import approvedViz from '../definitions/approvedViz'
import CatalogueItem from './CatalogueItem'
import HeaderTabs from './HeaderTabs'
import SelectedComponent from './SelectedComponent'

const HEADER_HEIGHT = '67px'

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
  background-color: ${({ theme }) => theme.color('background')};
  overflow-y: scroll;
  flex-grow: 1;
  flex-shrink: 1;
`

const CatalogueBkg = styled.div`
  display: flex;
`

const Header = styled.div`
  z-index: 50;
  top: 0;
  left: 0;
  width: 100%;
  height: ${HEADER_HEIGHT};
  background: ${({ theme }) => theme.color('contrast')};
  border-bottom: ${({ theme }) =>
    `${theme.spacing()} solid ${theme.color('primary')}`};
`

function Page() {
  const [selected, setSelected] = useState(null)

  return (
    <Container>
      <Header>
        <HeaderTabs />
      </Header>
      <Main>
        {selected !== null && (
          <RootNodeProvider>
            <SelectedComponent viz={approvedViz[selected]} />
          </RootNodeProvider>
        )}
        <RootNodeProvider>
          <CatalogueBkg>
            {approvedViz.map(
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

export default Page
