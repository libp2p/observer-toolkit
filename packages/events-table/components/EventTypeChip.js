import React from 'react'
import T from 'prop-types'

import { DynamicChip, Monospace } from '@libp2p/observer-sdk'

function EventTypeChip({ value }) {
  return (
    <Monospace>
      <DynamicChip value={value} iconSize={16} />
    </Monospace>
  )
}

EventTypeChip.propTypes = {
  value: T.string.isRequired,
}

export default EventTypeChip
