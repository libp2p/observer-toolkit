import React, { useContext, useMemo } from 'react'

import DataTable from './DataTable'
import PeerId from '../PeerId'
import { DataContext, TimeContext } from '../DataProvider'
import { useCurrentTime, getTraffic, getConnections, getAge } from '../utils'
import { numericSorter, stringSorter, statusSorter } from './sorters'
import ConnectionsTableRow from './ConnectionsTableRow'
import { TimeNumber, DataNumber } from './numberFields'

function copyToClipboard(text) {
  // TODO: expand this and include a toast notice on success
  navigator.clipboard.writeText(text)
}

// TODO: share these with mock
const statuses = ['ACTIVE', 'CLOSED', 'OPENING', 'CLOSING', 'ERROR']
const transports = ['TCP', 'UDP', 'QUIC', 'RDP']

function ConnectionsTable() {
  const dataset = useContext(DataContext)
  const time = useContext(TimeContext)

  const currentTime = useCurrentTime(dataset, time)

  const columns = [
    {
      name: 'peerId',
      content: 'Peer ID',
      sort: stringSorter,
      sortKey: 'peerId',
    },
    {
      name: 'data-in',
      content: 'Data in',
      sort: numericSorter,
      sortKey: 'value',
    },
    {
      name: 'data-out',
      content: 'Data out',
      sort: numericSorter,
      sortKey: 'value',
    },
    {
      name: 'age',
      content: 'Time open',
      sort: numericSorter,
      sortKey: 'value',
    },
    { name: 'streams', sort: numericSorter },
    { name: 'transport', sort: stringSorter },
    { name: 'status', sort: statusSorter },
  ]

  const rows = useMemo(
    () =>
      getConnections(currentTime).map(connection => {
        const peerId = connection.getPeerId()
        const status = statuses[connection.getStatus()]

        const openTs = connection.getTimeline().getOpenTs()
        const closeTs = connection.getTimeline().getCloseTs()

        const age = getAge(time, openTs, closeTs)
        const transportIdBin = connection.getTransportId()
        const transportIdInt = Buffer.from(transportIdBin).readUIntLE(
          0,
          transportIdBin.length
        )

        const dataIn = getTraffic(connection, 'in', 'bytes')
        const dataOut = getTraffic(connection, 'out', 'bytes')

        const rowContent = [
          {
            peerId,
            content: (
              <PeerId onClick={() => copyToClipboard(peerId)} id={peerId}>
                Copy "{peerId}" to the clipboard
              </PeerId>
            ),
          },
          {
            value: dataIn,
            content: (
              <DataNumber value={dataIn}>
                {`${dataIn} inbound bytes during this connection's lifecycle`}
              </DataNumber>
            ),
          },
          {
            value: dataOut,
            content: (
              <DataNumber value={dataOut}>
                {`${dataOut} outbound bytes during this connection's lifecycle`}
              </DataNumber>
            ),
          },
          {
            value: age,
            content: (
              <TimeNumber value={age}>
                {`Connection was open for ${age} miliseconds`}
              </TimeNumber>
            ),
          },
          {
            content: connection.getStreams().getStreamsList().length,
          },
          {
            content: transports[transportIdInt],
          },
          {
            content: status,
          },
        ]

        return rowContent
      }),
    [currentTime, time]
  )

  return (
    <DataTable
      rows={rows}
      columns={columns}
      TableRow={ConnectionsTableRow}
      defaultSortBy={6}
    />
  )
}

export default ConnectionsTable
