import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { Icon, SetterContext, WebsocketContext } from '@nearform/observer-sdk'

// TODO: animate circle for incoming state using stroke-dasharray transition
// like in https://stackoverflow.com/questions/26178095/svg-circle-animation

const IconButton = styled.button`
  color: ${({ theme, hasFocus }) =>
    theme.color(!hasFocus ? 'highlight' : 'background')};
  background: ${({ theme, hasFocus }) =>
    theme.color(hasFocus ? 'highlight' : 'background')};
  margin: ${({ theme }) => theme.spacing([0, 1, 0, 0.5])};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  position: relative;
  padding: ${({ theme }) => theme.spacing(0.5)};
  z-index: 2;
`

const IconWrapper = styled.span`
  position: relative;
`

const ActionLabel = styled.div`
  background: ${({ theme }) => theme.color('highlight')};
  color: ${({ theme }) => theme.color('background')};
  font-weight: 800;
  white-space: nowrap;
  position: absolute;
  border-radius: ${({ theme }) => theme.spacing(1)};
  top: ${({ theme }) => theme.spacing(0.3)};
  left: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing([0, 2])};
  height: ${({ theme }) => theme.spacing(3)};
  display: flex;
  align-items: center;
`

function WebsocketControl() {
  const [hasFocus, setHasFocus] = useState(false)
  const { isPaused, sendSignal } = useContext(WebsocketContext) || {}
  const { dispatchWebsocket } = useContext(SetterContext)

  const showPauseIcon = hasFocus ? !isPaused : isPaused
  const iconType = showPauseIcon ? 'pause' : 'play'

  const actionText = isPaused ? 'Unpause data' : 'Pause data'

  const handleFocus = e => {
    e.stopPropagation()
    if (!hasFocus) setHasFocus(true)
  }
  const handleBlur = e => {
    e.stopPropagation()
    if (hasFocus) setHasFocus(false)
  }

  const handleClick = e => {
    e.stopPropagation()

    // Data may have been disconnected before click is handled
    if (!sendSignal) return

    const signalType = isPaused ? 'resume' : 'pause'
    sendSignal(signalType)

    // TODO: move this to some sort of callback (non-trivial, ws.send lacks callback support)
    dispatchWebsocket({
      action: 'onPauseChange',
      isPaused: !isPaused,
    })
  }

  // TODO: Add tooltip on the right saying "Pause" / "Unpause"
  return (
    <IconButton
      tabIndex={0}
      onClick={handleClick}
      onMouseEnter={handleFocus}
      onFocus={handleFocus}
      onMouseLeave={handleBlur}
      onBlur={handleBlur}
      hasFocus={hasFocus}
    >
      {hasFocus && <ActionLabel>{actionText}</ActionLabel>}
      <IconWrapper>
        <Icon type={iconType} />
      </IconWrapper>
    </IconButton>
  )
}

export default WebsocketControl
