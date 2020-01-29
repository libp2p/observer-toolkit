import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  formatDuration,
  Bubble,
  DataNumber,
  PeerIdChip,
  StatusChip,
  TableHead,
  TimeNumber,
  Tooltip,
} from '@libp2p-observer/sdk'

const Nowrap = styled.span`
  white-space: nowrap;
`

const StreamsTableHead = styled(TableHead).attrs(() => ({
  colSpan: '2',
}))`
  text-align: center;
`

function StatusContent({ value }) {
  return <StatusChip status={value} />
}
StatusContent.propTypes = {
  value: T.string,
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
  const ageSeconds = Math.round(value / 1000)
  return (
    <Tooltip content={<Nowrap>{formatDuration(value)}</Nowrap>}>
      <Nowrap>
        <TimeNumber value={ageSeconds} />
        <Bubble value={value} maxValue={maxValue} inline size={24} />
      </Nowrap>
    </Tooltip>
  )
}
AgeContent.propTypes = {
  value: T.string,
  maxValue: T.num,
}

export {
  AgeContent,
  BytesContent,
  PeerIdContent,
  StatusContent,
  StreamsTableHead,
}
