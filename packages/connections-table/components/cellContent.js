import React from 'react'
import T from 'prop-types'

import StatusChip from './StatusChip'
import { PeerId, TimeNumber, DataNumber } from '@libp2p-observer/sdk'

function StatusContent({ value }) {
  return <StatusChip status={value} />
}
StatusContent.propTypes = {
  value: T.string,
}

function PeerIdContent({ value }) {
  return <PeerId peerId={value} />
}
PeerIdContent.propTypes = {
  value: T.string,
}

function BytesContent({ value, label }) {
  return (
    <DataNumber value={value}>
      {`${value} ${label} bytes during this connection's lifecycle`}
    </DataNumber>
  )
}
BytesContent.propTypes = {
  value: T.num,
  label: T.string,
}

function AgeContent({ value }) {
  return (
    <TimeNumber value={value}>
      {`Connection was open for ${value} miliseconds`}
    </TimeNumber>
  )
}
AgeContent.propTypes = {
  value: T.string,
}

export { AgeContent, BytesContent, PeerIdContent, StatusContent }
