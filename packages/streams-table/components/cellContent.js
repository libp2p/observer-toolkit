import React from 'react'
import T from 'prop-types'

import { PeerId, TimeNumber, DataNumber } from 'sdk'

function PeerIdContent({ value }) {
  return (
    <PeerId onClick={() => copyToClipboard(value)} id={value}>
      Copy "{value}" to the clipboard
    </PeerId>
  )
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

function copyToClipboard(text) {
  // TODO: expand this and include a toast notice on success
  navigator.clipboard.writeText(text)
}

export { AgeContent, BytesContent, PeerIdContent }
