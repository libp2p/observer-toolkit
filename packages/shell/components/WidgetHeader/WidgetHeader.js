import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  AccordionControl,
  Icon,
  SlideDown,
  Tooltip,
} from '@libp2p-observer/sdk'
import FiltersButton from './FiltersButton'
import FiltersTray from './FiltersTray'

import ReactMarkdown from 'react-markdown'

const Title = styled.h1`
  color: ${({ theme }) => theme.color('contrast')};
  ${({ theme }) => theme.text('heading', 'medium')}
  display: inline-block;
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const TitleSection = styled.div`
  flex-grow: 1;
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

const Header = styled.header`
  ${({ theme }) => theme.text('body', 'medium')}
  border-bottom: 1px solid ${({ theme }) => theme.color('background', 1)};
  padding: ${({ theme }) => theme.spacing([1, 2])};
  display: flex;
  align-items: center;
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

function WidgetHeader({ name, description, closeWidget }) {
  const [descriptionOpen, setDescriptionOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <>
      <Header>
        <TitleSection>
          <Title>{name}</Title>
          <AccordionControl
            isOpen={descriptionOpen}
            setIsOpen={setDescriptionOpen}
          >
            About
          </AccordionControl>
        </TitleSection>
        <FiltersButton isOpen={filtersOpen} setIsOpen={setFiltersOpen} />
        {closeWidget && (
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
              <Icon
                aria-label="Close"
                type="cancel"
                onClick={closeWidget}
                size={'3em'}
              />
            </Tooltip>
          </CloseButton>
        )}
      </Header>
      <SlideDown isOpen={filtersOpen}>
        {filtersOpen && (
          <Section>
            <FiltersTray />
          </Section>
        )}
      </SlideDown>
      <SlideDown isOpen={descriptionOpen}>
        {descriptionOpen && (
          <Section>
            <ReactMarkdown source={description} />
          </Section>
        )}
      </SlideDown>
    </>
  )
}

WidgetHeader.propTypes = {
  name: T.string.isRequired,
  description: T.string,
  closeWidget: T.func,
}

export default WidgetHeader
