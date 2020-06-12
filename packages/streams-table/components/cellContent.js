import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { timeFormat } from 'd3'
const timeFormatter = timeFormat('%H:%M:%S.%L')

import {
  formatDuration,
  Bubble,
  DataNumber,
  Monospace,
  PeerIdChip,
  StatusChip,
  TimeNumber,
  Tooltip,
} from '@nearform/observer-sdk'

const Nowrap = styled.span`
  white-space: nowrap;
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
    <Tooltip side="right" content={<Nowrap>{value} bytes</Nowrap>}>
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
    <Tooltip side="right" content={<Nowrap>{formatDuration(value)}</Nowrap>}>
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

function TimeContent({ value }) {
  return (
    <Tooltip side="right" content={<Nowrap>{value}</Nowrap>}>
      {value ? timeFormatter(value) : '-'}
    </Tooltip>
  )
}
TimeContent.propTypes = {
  value: T.num,
}

function MonospaceContent({ value }) {
  return <Monospace>{value}</Monospace>
}
MonospaceContent.propTypes = {
  value: T.string,
}

export {
  AgeContent,
  BytesContent,
  MonospaceContent,
  PeerIdContent,
  StatusContent,
  TimeContent,
}
