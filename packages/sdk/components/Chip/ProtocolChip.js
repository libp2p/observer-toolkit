import React from 'react'
import T from 'prop-types'

import { DynamicChip, Monospace } from '@libp2p/observer-sdk'

function ProtocolChip({ value }) {
  return (
    <Monospace>
      <DynamicChip value={value} iconSize={16} splitIndex={1} />
    </Monospace>
  )
}

ProtocolChip.propTypes = {
  value: T.string.isRequired,
}

export default ProtocolChip
