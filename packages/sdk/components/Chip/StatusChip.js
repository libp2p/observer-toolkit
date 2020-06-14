import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { statusNames } from '@libp2p/observer-data'
import { StaticChip, ConfigContext, Tooltip } from '@libp2p/observer-sdk'

const TooltipContainer = styled.div`
  width: 200%;
`

const options = {
  ACTIVE: {
    icon: 'check',
    colorKey: 'tertiary',
    colorIndex: 2,
  },
  OPENING: {
    icon: 'opening',
    colorKey: 'tertiary',
    colorIndex: 1,
  },
  CLOSING: {
    icon: 'closing',
    colorKey: 'highlight',
    colorIndex: 0,
  },
  CLOSED: {
    icon: 'closed',
    colorKey: 'highlight',
    colorIndex: 1,
  },
  ERROR: {
    icon: 'cancel',
    colorKey: 'contrast',
    colorIndex: 1,
  },
}

// Don't fade so much it becomes unreadable
const minFadeOpacity = 0.2
function getFadeOpacity(value, maxValue) {
  if (typeof value !== 'number' || typeof maxValue !== 'number') return 1
  const fadeAmount = Math.max(0, 1 - value / maxValue)
  const fadeOpacity = minFadeOpacity + (1 - minFadeOpacity) * fadeAmount
  return fadeOpacity
}

const maxGlowOpacity = 0.4
function getGlowOpacity(value, maxValue) {
  if (typeof value !== 'number' || typeof maxValue !== 'number') return 0
  const glowAmount = Math.max(0, 1 - value / maxValue)
  const glowOpacity = glowAmount * maxGlowOpacity
  return glowOpacity
}

function StatusChip({ status, timeOpen, timeClosed, duration }) {
  const config = useContext(ConfigContext)
  const expiryMs = config ? config.getRetentionPeriodMs() : 0
  const fade = status === 'CLOSED' ? getFadeOpacity(timeClosed, expiryMs) : null
  const glow =
    status === 'ACTIVE' ? getGlowOpacity(timeOpen, duration * 4) : null

  const secondsUntilExpire = fade && Math.round((expiryMs - timeClosed) / 1000)

  const tooltipText =
    (glow && `New connection, open ${timeOpen} ms`) ||
    (fade &&
      `Fading off table in ${secondsUntilExpire} second${
        secondsUntilExpire === 1 ? '' : 's'
      }`) ||
    null

  return (
    <Tooltip
      content={tooltipText}
      side={'right'}
      toleranceY={null}
      fixOn={'never'}
      override={{ Content: TooltipContainer }}
    >
      <StaticChip type={status} options={options} fade={fade} glow={glow}>
        {status}
      </StaticChip>
    </Tooltip>
  )
}

StatusChip.propTypes = {
  status: T.oneOf(Object.values(statusNames)),
  timeOpen: T.number,
  timeClosed: T.number,
  duration: T.number,
}

export default StatusChip
