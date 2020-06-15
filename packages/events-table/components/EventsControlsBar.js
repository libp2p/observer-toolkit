import React, { useState } from 'react'
import T from 'prop-types'
import styled, { css } from 'styled-components'

import { AccordionControl, StyledButton } from '@libp2p/observer-sdk'

import EventsTypeControls from './EventsTypeControls'

function getShowButtonText(eventsSincePause, isLive) {
  if (isLive) return 'Updating live...'
  if (!eventsSincePause) return 'No events since pause'
  if (eventsSincePause < 0) return `Update (${eventsSincePause * -1} removed)`
  return `Update (${eventsSincePause} added)`
}

const EventsControlsContainer = styled.section`
  position: sticky;
  top: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ barHeight }) => barHeight}px;
  background: ${({ theme }) => theme.color('secondary', 2)};
  ${({ theme }) => theme.text('body', 'medium')}
`

const EventTypesBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 1;
`

const PauseControlsBlock = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
`

const PauseButtonsBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const PauseControlsItem = styled.div`
  margin: ${({ theme }) => theme.spacing([0, 1])};
`

const PauseControlsStatus = styled.div`
  padding: ${({ theme }) => theme.spacing([0.5, 2])};
  margin: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.color('background')};
  color: ${({ theme }) => theme.color('text', 1)};
  font-weight: ${({ isLive }) => (isLive ? 400 : 700)};
`

const RefreshEventsButton = styled(StyledButton)`
  ${({ theme, isLive }) =>
    isLive
      ? css`
          color: ${theme.color('text', 2, 0.5)};
          border-color: ${theme.color('text', 2, 0.5)};
        `
      : ''}
`

const EventsHeading = styled.h2`
  ${({ theme }) => theme.text('heading', 'medium')};
  margin: ${({ theme }) => theme.spacing([0.5, 1, 0])};
`

const EventsHeadingBlock = styled.div`
  margin: ${({ theme }) => theme.spacing([1, 2, 0.5])};
`

const AccordionButton = styled.button`
  font-weight: 400;
  display: block;
  margin: ${({ theme }) => theme.spacing([1, 0])};
  ${({ theme }) => theme.text('body', 'small')}
`

function EventsControlsBar({
  barHeight,
  currentEventsData,
  hasLiveSource,
  isLive,
  changePausedState,
  eventsSincePause,
  isPaused,
  highlightedRowIndex,
  propertyTypes,
  dispatchPropertyTypes,
}) {
  const [isTypesOpen, setIsTypesOpen] = useState(false)

  const pauseButtonText = isPaused ? 'Unpause' : 'Pause'
  const pausedText =
    !isPaused && highlightedRowIndex !== null
      ? 'Paused while row highlighted'
      : 'Incoming events paused'

  const showButtonText = getShowButtonText(eventsSincePause, isLive)

  return (
    <EventsControlsContainer height={barHeight}>
      <EventTypesBlock>
        <EventsHeadingBlock>
          <EventsHeading>{currentEventsData.length} events</EventsHeading>
          <AccordionControl
            isOpen={isTypesOpen}
            setIsOpen={setIsTypesOpen}
            direction="horizontal"
            override={{ AccordionButton }}
          >
            Types, column settings
          </AccordionControl>
        </EventsHeadingBlock>
        {isTypesOpen && (
          <EventsTypeControls
            events={currentEventsData}
            propertyTypes={propertyTypes}
            dispatchPropertyTypes={dispatchPropertyTypes}
          />
        )}
      </EventTypesBlock>
      {hasLiveSource && (
        <PauseControlsBlock>
          <PauseControlsStatus isLive={isLive}>
            {isLive ? 'Showing incoming events' : pausedText}
          </PauseControlsStatus>
          <PauseButtonsBlock>
            <PauseControlsItem>
              <RefreshEventsButton
                onClick={() => changePausedState(isPaused)}
                disabled={isLive || !eventsSincePause}
                isLive={isLive}
              >
                {showButtonText}
              </RefreshEventsButton>
            </PauseControlsItem>
            <PauseControlsItem>
              <StyledButton onClick={() => changePausedState(!isPaused)}>
                {pauseButtonText}
              </StyledButton>
            </PauseControlsItem>
          </PauseButtonsBlock>
        </PauseControlsBlock>
      )}
    </EventsControlsContainer>
  )
}

EventsControlsBar.propTypes = {
  barHeight: T.number.isRequired,
  currentEventsData: T.array.isRequired,
  hasLiveSource: T.bool,
  isLive: T.bool,
  changePausedState: T.func.isRequired,
  eventsSincePause: T.number,
  isPaused: T.bool,
  highlightedRowIndex: T.number,
  propertyTypes: T.array.isRequired,
  dispatchPropertyTypes: T.func.isRequired,
}

export default EventsControlsBar
