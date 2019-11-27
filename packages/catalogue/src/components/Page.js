import React, { useState } from 'react'
import styled from 'styled-components'

import { ControlPanel } from '@libp2p-observer/shell'

import approvedViz from '../definitions/approvedViz'
import CatalogueItem from './CatalogueItem'
import HeaderTabs from './HeaderTabs'
import SelectedComponent from './SelectedComponent'

const HEADER_HEIGHT = '64px'
const FOOTER_HEIGHT = 128

const Main = styled.div`
  margin-top: ${HEADER_HEIGHT};
  margin-bottom: ${FOOTER_HEIGHT};
  background-color: ${({ theme }) => theme.color('background')};
  overflow-y: scroll;
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

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${FOOTER_HEIGHT + 14}px;
  background: ${({ theme }) => theme.color('contrast')};
  color: ${({ theme }) => theme.color('text', 2)};
  font-weight: bold;
  padding: 0;
  margin: 0;
  border-top: ${({ theme }) =>
    `${theme.spacing()} solid ${theme.color('contrast')}`};
`

function Page() {
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <Header>
        <HeaderTabs />
      </Header>
      <Main>
        {selected !== null && <SelectedComponent viz={approvedViz[selected]} />}
        <CatalogueBkg>
          {approvedViz.map(({ name, description, tags, screenshot }, index) => (
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
          ))}
        </CatalogueBkg>
      </Main>
      <Footer>
        <ControlPanel />
      </Footer>
    </div>
  )
}

export default Page
