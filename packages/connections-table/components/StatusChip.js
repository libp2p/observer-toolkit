import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { statusNames } from '@libp2p-observer/data'
import { Icon } from '@libp2p-observer/sdk'

const Container = styled.span`
  display: inline-block;
  padding: 0 ${({ theme }) => theme.spacing(0.5)};
  background: ${({ theme, getColor }) => getColor(theme, 0.15)};
  color: ${({ theme, getColor }) => getColor(theme, 1)};
  white-space: nowrap;
  font-size: 8pt;
  font-weight: 600;
`

const ChipText = styled.span`
  line-height: 1em;
  display: inline-block;
  padding: ${({ theme }) => theme.spacing()}
    ${({ theme }) => theme.spacing(0.5)};
  vertical-align: middle;
`

function StatusChip({ status }) {
  const chipMap = {
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

  if (!chipMap[status]) {
    throw new Error(`Status name "${status}" not recognised`)
  }
  const { icon, colorKey, colorIndex } = chipMap[status]

  const getColor = (theme, opacity) =>
    theme.color(colorKey, colorIndex || 0, opacity)

  return (
    <Container getColor={getColor}>
      <Icon type={icon} />
      <ChipText>{status}</ChipText>
    </Container>
  )
}

StatusChip.propTypes = {
  status: T.oneOf(Object.values(statusNames)),
}

export default StatusChip
