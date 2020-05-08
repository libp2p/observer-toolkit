import React from 'react'
import T from 'prop-types'

import { statusNames } from '@libp2p/observer-data'
import { Chip } from '@libp2p/observer-sdk'

function StatusChip({ status }) {
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

  return (
    <Chip type={status} options={options}>
      {status.toLower}
    </Chip>
  )
}

StatusChip.propTypes = {
  status: T.oneOf(Object.values(statusNames)),
}

export default StatusChip
