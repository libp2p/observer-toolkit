import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { AccordionControl, Icon, Tooltip } from '@libp2p-observer/sdk'
import ReactMarkdown from 'react-markdown'
import { SlideDown } from 'react-slidedown'

const Container = styled.article`
  overflow: auto;
  background: ${({ theme }) => theme.color('background')};
  border-radius: ${({ theme }) => theme.spacing()};
  ${({ theme }) => theme.boxShadow({ size: 1.5, opacity: 0.3 })};
`

const Header = styled.header`
  padding: ${({ theme }) => theme.spacing([1, 2])};
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
  margin-top: ${({ theme }) => theme.spacing()};
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

const Description = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.color('background', 1)};
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing([0, 4])};
  ${({ theme }) => theme.text('body', 'medium')}
  ${({ theme }) => theme.transition()}
`

const TooltipContent = styled.div`
  color: ${({ theme }) => theme.color('highlight', 1)};
  white-space: nowrap;
`

function SelectedWidget({ widget, setSelected }) {
  const { Component, name, description } = widget
  const [descriptionOpen, setDescriptionOpen] = useState(false)

  const handleClose = () => setSelected(null)

  return (
    <Container>
      <Header>
        <Title>
          {name}
          <AccordionControl
            isOpen={descriptionOpen}
            setIsOpen={setDescriptionOpen}
          >
            About
          </AccordionControl>
        </Title>
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
      <SlideDown as={Description}>
        {descriptionOpen && <ReactMarkdown source={description} />}
      </SlideDown>
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
  setSelected: T.func.isRequired,
}

export default SelectedWidget
