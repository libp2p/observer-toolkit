import React, { useState } from 'react'
import styled from 'styled-components'

import { RootNodeProvider } from '@nearform/observer-sdk'
import { ControlPanel } from '@nearform/observer-shell'

import approvedWidgets from '../definitions/approvedWidgets'
import CatalogueItem from '../components/CatalogueItem'
import Header from '../components/Header'

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

const ScrollArea = styled.div`
  overflow-y: scroll;
  flex-grow: 1;
  flex-shrink: 1;
`

const Main = styled.div`
  padding: ${({ theme }) => theme.spacing([2, 1])};
  background-color: ${({ theme }) => theme.color('background', 1)};
  position: relative;
`

const CatalogueBkg = styled.div`
  display: flex;
`

function Connected() {
  const [selected, setSelected] = useState(null)
  const selectedWidget = approvedWidgets[selected]
  const closeWidget = () => setSelected(null)

  return (
    <Container>
      <ScrollArea>
        <Header />
        <Main>
          <RootNodeProvider>
            {selectedWidget ? (
              <selectedWidget.Widget closeWidget={closeWidget} />
            ) : (
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
            )}
          </RootNodeProvider>
        </Main>
      </ScrollArea>
      <ControlPanel />
    </Container>
  )
}

export default Connected
