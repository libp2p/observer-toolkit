import React from 'react'
import T from 'prop-types'

import { getAge, getTraffic, statusNames, transportNames } from 'proto'

import { PeerId, TimeNumber, DataNumber } from 'sdk'

import * as statusSorter from '../utils/statusSorter'

// Content renderers:
// TODO: move to components dir

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

// Column definitions:

const peerIdCol = {
  name: 'peerId',
  header: 'Peer ID',
  getProps: connection => ({ value: connection.getPeerId() }),
  renderContent: PeerIdContent,
  sort: {
    preset: 'string',
  },
}

const dataInCol = {
  name: 'data-in',
  header: 'Data in',
  getProps: connection => ({
    value: getTraffic(connection, 'in', 'bytes'),
    label: 'inbound',
  }),
  renderContent: BytesContent,
  sort: {
    preset: 'number',
  },
}

const dataOutCol = {
  name: 'data-out',
  header: 'Data out',
  getProps: connection => ({
    value: getTraffic(connection, 'out', 'bytes'),
    label: 'outbound',
  }),
  renderContent: BytesContent,
  sort: {
    preset: 'number',
  },
}

const ageCol = {
  name: 'age',
  header: 'Time open',
  getProps: (connection, timepoint) => {
    const time = timepoint.getInstantTs()
    const openTs = connection.getTimeline().getOpenTs()
    const closeTs = connection.getTimeline().getCloseTs()
    const age = getAge(time, openTs, closeTs)
    return { value: age }
  },
  renderContent: AgeContent,
  sort: {
    preset: 'number',
  },
}

const streamsCol = {
  name: 'streams',
  getProps: connection => ({
    value: connection.getStreams().getStreamsList().length,
  }),
  sort: {
    preset: 'number',
  },
}

const transportCol = {
  name: 'transport',
  getProps: connection => {
    const transportIdBin = connection.getTransportId()
    const transportIdInt = Buffer.from(transportIdBin).readUIntLE(
      0,
      transportIdBin.length
    )
    return { value: transportNames[transportIdInt] }
  },
  sort: {
    preset: 'string',
  },
}

const statusCol = {
  name: 'status',
  getProps: connection => ({ value: statusNames[connection.getStatus()] }),
  sort: statusSorter,
  filter: {
    applyFilter: (excludeArray, connection) =>
      !excludeArray.has(statusNames[connection.getStatus()]),
    defaultFilterSelection: [],
  },
}

// Define column order

const columns = [
  peerIdCol,
  dataInCol,
  dataOutCol,
  ageCol,
  streamsCol,
  transportCol,
  statusCol,
]

export default columns
