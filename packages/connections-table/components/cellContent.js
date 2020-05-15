import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  formatDuration,
  Bubble,
  DataNumber,
  PeerIdChip,
  StatusChip,
  FormatedNumber,
  Tooltip,
} from '@libp2p-observer/sdk'

const Nowrap = styled.span`
  white-space: nowrap;
`

function StatusContent({ value, ...props }) {
  return <StatusChip status={value} {...props} />
}
StatusContent.propTypes = {
  value: T.string,
  timeOpen: T.number,
  timeClosed: T.number,
}

function PeerIdContent({ value }) {
  return <PeerIdChip peerId={value} />
}
PeerIdContent.propTypes = {
  value: T.string,
}

function BytesContent({ value, maxValue, colorKey }) {
  return (
    <Tooltip content={<Nowrap>{value} bytes</Nowrap>}>
      <Nowrap>
        <DataNumber value={value} />
        <Bubble
          value={value}
          maxValue={maxValue}
          inline
          size={24}
          colorKey={colorKey}
        />
      </Nowrap>
    </Tooltip>
  )
}
BytesContent.propTypes = {
  value: T.num,
  maxValue: T.num,
  colorKey: T.string,
}

function AgeContent({ value, maxValue }) {
  const ageMs = Math.round(value)
  return (
    <Tooltip content={<FormatedNumber value={ageMs} unit="ms" />}>
      <Nowrap>
        <Nowrap>{formatDuration(value, 2, true)}</Nowrap>
        <Bubble value={value} maxValue={maxValue} inline size={24} />
      </Nowrap>
    </Tooltip>
  )
}
AgeContent.propTypes = {
  value: T.string,
  maxValue: T.num,
}

export { AgeContent, BytesContent, PeerIdContent, StatusContent }
