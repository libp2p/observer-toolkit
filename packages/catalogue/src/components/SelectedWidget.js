import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  AccordionControl,
  Icon,
  Tooltip,
  FilterProvider,
} from '@libp2p-observer/sdk'
import FiltersButton from './FiltersButton'
import FiltersTray from './FiltersTray'

import ReactMarkdown from 'react-markdown'
import { SlideDown } from 'react-slidedown'

const Container = styled.article`
  overflow: auto;
  background: ${({ theme }) => theme.color('background')};
  border-radius: ${({ theme }) => theme.spacing()};
  ${({ theme }) => theme.boxShadow({ size: 1.5, opacity: 0.3 })};
  min-height: 320px;
`

const Header = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.color('background', 1)};
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

const SlideDownSection = styled(SlideDown)`
  ${({ theme }) => theme.transition()}
  &.transitioning {
    overflow: hidden;
  }
`

const Section = styled.section`
  ${({ theme }) => theme.text('body', 'medium')}
  padding: ${({ theme }) => theme.spacing([0, 4])};
  border-bottom: 1px solid ${({ theme }) => theme.color('background', 1)};
`

const TooltipContent = styled.div`
  color: ${({ theme }) => theme.color('highlight', 1)};
  white-space: nowrap;
`

function SelectedWidget({ widget, setSelected }) {
  const { Component, name, description, filterDefs = [] } = widget

  const [descriptionOpen, setDescriptionOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const handleClose = () => setSelected(null)

  return (
    <FilterProvider filterDefs={filterDefs}>
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
          <FiltersButton isOpen={filtersOpen} setIsOpen={setFiltersOpen} />
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
              <Icon type="cancel" onClick={handleClose} size={'3em'} />
            </Tooltip>
          </CloseButton>
        </Header>
        <SlideDownSection>
          {filtersOpen && (
            <Section>
              <FiltersTray filterDefs={filterDefs} />
            </Section>
          )}
        </SlideDownSection>
        <SlideDownSection>
          {descriptionOpen && (
            <Section>
              <ReactMarkdown source={description} />
            </Section>
          )}
        </SlideDownSection>
        <WidgetContainer>
          <Component />
        </WidgetContainer>
      </Container>
    </FilterProvider>
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
