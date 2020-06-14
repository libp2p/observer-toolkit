import React from 'react'
import T from 'prop-types'

import {
  Bubble,
  DataNumber,
  DurationNumber,
  FormatedNumber,
  Monospace,
  Nowrap,
  PeerIdChip,
  StatusChip,
  TimeNumber,
  Tooltip,
} from '../../components'

function RawNumberTooltip({ value, unit, children }) {
  return (
    <Tooltip
      side="right"
      content={<FormatedNumber value={value} unit={unit} />}
      override={{ Target: Nowrap }}
    >
      {children}
    </Tooltip>
  )
}
RawNumberTooltip.propTypes = {
  value: T.number.isRequired,
  unit: T.string,
  children: T.node.isRequired,
}

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

function TimeContent({ value, includeMs }) {
  return (
    <RawNumberTooltip value={value} unit="timestamp">
      {value ? <TimeNumber value={value} includeMs={includeMs} /> : '-'}
    </RawNumberTooltip>
  )
}
TimeContent.propTypes = {
  value: T.num,
  includeMs: T.bool,
}

function BubbleContent({ value, maxValue, NumberField, baseUnit, colorKey }) {
  const Wrapper = NumberField ? RawNumberTooltip : Nowrap

  const ValueContainer = NumberField || FormatedNumber

  return (
    <Wrapper value={value} unit={baseUnit}>
      <Nowrap>
        <ValueContainer value={value} />
      </Nowrap>
      <Bubble
        value={value}
        maxValue={maxValue}
        inline
        size={24}
        colorKey={colorKey}
      />
    </Wrapper>
  )
}
BubbleContent.propTypes = {
  value: T.number.isRequired,
  maxValue: T.number.isRequired,
  NumberField: T.elementType,
  baseUnit: T.string,
  colorKey: T.string,
}

function DurationContent({ value, maxValue, ...props }) {
  const effectiveValue = Math.max(0, value)
  if (!maxValue) {
    return (
      <RawNumberTooltip value={effectiveValue} unit={'ms'}>
        <DurationNumber value={effectiveValue}></DurationNumber>
      </RawNumberTooltip>
    )
  }
  return (
    <BubbleContent
      value={effectiveValue}
      maxValue={maxValue}
      NumberField={DurationNumber}
      baseUnit="ms"
      {...props}
    />
  )
}
DurationContent.propTypes = {
  value: T.number.isRequired,
  maxValue: T.number.isRequired,
}

function BytesContent({ value, maxValue, ...props }) {
  return (
    <BubbleContent
      value={value}
      maxValue={maxValue}
      NumberField={DataNumber}
      baseUnit=" bytes"
      {...props}
    />
  )
}
BytesContent.propTypes = {
  value: T.number.isRequired,
  maxValue: T.number.isRequired,
}

function MonospaceContent({ value }) {
  return <Monospace>{value}</Monospace>
}
MonospaceContent.propTypes = {
  value: T.string,
}

export {
  BubbleContent,
  BytesContent,
  DurationContent,
  MonospaceContent,
  PeerIdContent,
  RawNumberTooltip,
  StatusContent,
  TimeContent,
}
