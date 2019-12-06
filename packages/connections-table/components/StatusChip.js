import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { statusNames } from '@libp2p-observer/data'
import { Icon } from '@libp2p-observer/sdk'

const Container = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(0.5)};
  background: ${({ theme, getColor }) => getColor(theme, 0.3)};
  color: ${({ theme, getColor }) => getColor(theme, 1)};
  white-space: nowrap;
  font-size: 8pt;
  font-weight: 600;
`

const ChipText = styled.span`
  line-height: 1em;
`

function StatusChip({ status }) {
  const chipMap = {
    ACTIVE: {
      icon: 'check',
      getColor: (theme, opacity) => theme.color('tertiary', 2, opacity),
    },
    OPENING: {
      icon: 'opening',
      getColor: (theme, opacity) => theme.color('tertiary', 1, opacity),
    },
    CLOSING: {
      icon: 'closing',
      getColor: (theme, opacity) => theme.color('highlight', 0, opacity),
    },
    CLOSED: {
      icon: 'closed',
      getColor: (theme, opacity) => theme.color('highlight', 1, opacity),
    },
    ERROR: {
      icon: 'cancel',
      getColor: (theme, opacity) => theme.color('contrast', 2, opacity),
    },
  }

  if (!chipMap[status])
    throw new Error(`Status name "${status}" not recognised`)
  const { getColor, icon } = chipMap[status]

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
