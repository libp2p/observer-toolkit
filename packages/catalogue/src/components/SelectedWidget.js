import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon, Tooltip } from '@libp2p-observer/sdk'

const Container = styled.article`
  overflow: auto;
  background: ${({ theme }) => theme.color('background')};
  border-radius: ${({ theme }) => theme.spacing()};
  ${({ theme }) => theme.boxShadow({ size: 1.5, opacity: 0.3 })};
`

const Header = styled.header`
  padding: ${({ theme }) => theme.spacing([1, 2])};
  border-bottom: 1px solid ${({ theme }) => theme.color('background', 1)};
  display: flex;
  align-items: center;
`

const WidgetContainer = styled.section`
  padding: ${({ theme }) => theme.spacing()};
`

const Title = styled.h1`
  flex-grow: 1;
  color: ${({ theme }) => theme.color('contrast')};
  ${({ theme }) => theme.text('heading', 'medium')}
`

const CloseButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  border-radius: 50%;
  color: ${({ theme }) => theme.color('highlight', 1)};
  ${({ theme }) => theme.text('label', 'medium')} :hover,
  :focus {
    background: ${({ theme }) => theme.color('highlight', 0)};
    color: ${({ theme }) => theme.color('background', 0)};
  }
`

const TooltipContent = styled.div`
  color: ${({ theme }) => theme.color('highlight', 1)};
  white-space: nowrap;
`

function SelectedWidget({ widget, setSelected }) {
  const { Component, name, description } = widget

  const handleClose = () => setSelected(null)

  return (
    <Container>
      <Header>
        <Title>{name}</Title>
        <CloseButton>
          <Tooltip
            side="left"
            fixOn="never"
            content={
              <TooltipContent>
                Close and return <br /> to catalogue
              </TooltipContent>
            }
          >
            <Icon type="cancel" onClick={handleClose} size={32} />
          </Tooltip>
        </CloseButton>
      </Header>
      <WidgetContainer>
        <Component />
      </WidgetContainer>
    </Container>
  )
}

SelectedWidget.propTypes = {
  widget: T.shape({
    Component: T.elementType.isRequired,
    name: T.string.isRequired,
    description: T.string,
  }),
}

export default SelectedWidget
