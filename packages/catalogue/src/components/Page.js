import React, { useState } from 'react'
import styled from 'styled-components'

import { Timeline } from 'sdk'

import approvedViz from '../definitions/approvedViz'
import CatalogueItem from './CatalogueItem'
import HeaderTabs from './HeaderTabs'
import SelectedComponent from './SelectedComponent'

const HEADER_HEIGHT = '64px'
const FOOTER_HEIGHT = 128

const Main = styled.div`
  margin-top: ${HEADER_HEIGHT};
  margin-bottom: ${FOOTER_HEIGHT};
  background-color: ${({ theme }) => theme.color('light', 'mid')};
  overflow-y: scroll;
`

const CatalogueBkg = styled.div`
  display: flex;
`

const Header = styled.div`
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  width: 100%;
  height: ${HEADER_HEIGHT};
  background: ${({ theme }) => theme.color('dark', 'mid')};
  border-bottom: ${({ theme }) =>
    `${theme.spacing()} solid ${theme.color('primary', 'mid')}`};
`

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${FOOTER_HEIGHT + 14}px;
  background: ${({ theme }) => theme.color('dark', 'mid')};
  color: ${({ theme }) => theme.color('light', 'light')};
  font-weight: bold;
  padding: 0;
  margin: 0;
  border-top: ${({ theme }) =>
    `${theme.spacing()} solid ${theme.color('dark', 'dark')}`};
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
        <Timeline height={FOOTER_HEIGHT} />
      </Footer>
    </div>
  )
}

export default Page
