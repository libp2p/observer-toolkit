import React, { useState } from 'react'
import styled from 'styled-components'

import { Timeline } from 'sdk'

import approvedViz from '../definitions/approvedViz'
import CatalogueItem from './CatalogueItem'
import HeaderTabs from './HeaderTabs'
import SelectedComponent from './SelectedComponent'

const HEADER_HEIGHT = '64px'
const FOOTER_HEIGHT = '192px'

function Page() {
  const [selected, setSelected] = useState(null)

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
    height: ${FOOTER_HEIGHT};
    background: ${({ theme }) => theme.color('dark', 'mid')};
    color: ${({ theme }) => theme.color('light', 'light')};
    font-weight: bold;
    padding: 0 ${({ theme }) => theme.spacing()};
    border-top: ${({ theme }) =>
      `${theme.spacing()} solid ${theme.color('dark', 'dark')}`};
  `

  return (
    <div>
      <Header>
        <HeaderTabs />
      </Header>
      <Main>
        {selected !== null && <SelectedComponent viz={approvedViz[selected]} />}
        <CatalogueBkg>
          {approvedViz.map(({ name, description, tags }, index) => (
            <CatalogueItem
              key={name}
              name={name}
              description={description}
              tags={tags}
              handleSelect={() =>
                setSelected(index === selected ? null : index)
              }
              isSelected={selected === index}
            />
          ))}
        </CatalogueBkg>
      </Main>
      <Footer>
        <Timeline />
      </Footer>
    </div>
  )
}

export default Page
