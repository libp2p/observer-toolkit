import React from 'react'
import styled from 'styled-components'
import T from 'prop-types'

import { DataTray } from '@nearform/observer-shell'

import DefaultContent from '../components/DefaultContent'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Header = styled.header`
  height: 50%;
  min-height: 340px;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-shrink: 1;
`

const LogoSection = styled.section`
  flex-shrink: 0;
  width: 33%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  max-width: 80%;
  max-height: 70%;
`

const LogoText = styled.h1`
  ${({ theme }) => theme.text('heading', 'large')}
  color: ${({ theme }) => theme.color('contrast')};
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(2)};
  border-top: 3px solid ${({ theme }) => theme.color('background', 2)};
  border-bottom: 3px solid ${({ theme }) => theme.color('background', 2)};
`

const DetailsSection = styled.section`
  flex-grow: 1;
  background: ${({ theme }) => theme.color('background', 2)};
  padding: 4% 14% 4%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Main = styled.main`
  height: 50%;
  min-height: 240px;
  display: flex;
  flex-direction: row;
`

const CallToActionSection = styled.section`
  width: 33%;
  flex-shrink: 0;
  height: 340px;
  background: ${({ theme }) => theme.color('contrast')};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 5%;
  :after {
    content: '';
    position: absolute;
    height: 0;
    width: 0;
    top: 0;
    right: -90px;
    border-top: 170px solid transparent;
    border-bottom: 170px solid transparent;
    border-left: 90px solid ${({ theme }) => theme.color('contrast')};
  }
`

const CallToActionHeading = styled.h1`
  ${({ theme }) => theme.text('heading', 'extraLarge')};
  color: ${({ theme }) => theme.color('text', 3)};
`

const CallToActionSubHeading = styled.h3`
  ${({ theme }) => theme.text('heading', 'large')};
  color: ${({ theme }) => theme.color('secondary', 1)};
`

function Home({ Content = DefaultContent }) {
  return (
    <Container>
      <Header>
        <LogoSection>
          <Logo src="logo_large.png" />
          <LogoText>Observation Deck</LogoText>
        </LogoSection>
        <DetailsSection>
          <Content />
        </DetailsSection>
      </Header>
      <Main>
        <CallToActionSection>
          <div>
            <CallToActionHeading>Get started</CallToActionHeading>
            <CallToActionSubHeading>
              Choose a data source <br /> from these options:
            </CallToActionSubHeading>
          </div>
        </CallToActionSection>
        <DataTray />
      </Main>
    </Container>
  )
}
Home.propTypes = {
  Content: T.elementType,
}

export default Home
