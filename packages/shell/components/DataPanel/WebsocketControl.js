import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import {
  Icon,
  SetterContext,
  Tooltip,
  WebsocketContext,
} from '@libp2p-observer/sdk'

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

const TooltipContent = styled.div`
  color: ${({ theme }) => theme.color('highlight')};
  font-weight: 600;
  white-space: nowrap;
`

function WebsocketControl() {
  const [hasFocus, setHasFocus] = useState(false)
  const { isPaused, sendSignal } = useContext(WebsocketContext) || {}
  const { dispatchWebsocket } = useContext(SetterContext)

  const showPauseIcon = hasFocus ? !isPaused : isPaused
  const iconType = showPauseIcon ? 'pause' : 'play'

  const tooltipText = isPaused ? 'Unpause incoming data' : 'Pause incoming data'

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

    const signalType = isPaused ? 'unpause' : 'pause'
    sendSignal(signalType)

    // TODO: move this to some sort of callback (non-trivial, ws.send lacks callback support)
    dispatchWebsocket({
      action: 'onPauseChange',
      isPaused: !isPaused,
    })
  }

  // TODO: Add tooltip on the right saying "Pause" / "Unpause"
  return (
    <Tooltip
      fixOn="never"
      side="right"
      toleranceY={null}
      content={<TooltipContent>{tooltipText}</TooltipContent>}
    >
      <IconButton
        tabIndex={0}
        onClick={handleClick}
        onMouseEnter={handleFocus}
        onFocus={handleFocus}
        onMouseLeave={handleBlur}
        onBlur={handleBlur}
        hasFocus={hasFocus}
      >
        <Icon type={iconType} />
      </IconButton>
    </Tooltip>
  )
}

export default WebsocketControl
