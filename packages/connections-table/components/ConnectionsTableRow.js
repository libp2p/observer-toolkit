import React, { useContext } from 'react'
import T from 'prop-types'
import { DataTableRow, PeerContext, SetterContext } from '@libp2p-observer/sdk'

function ConnectionsTableRow({ rowContentProps, columnDefs }) {
  const globalPeerId = useContext(PeerContext)
  const { setPeerId } = useContext(SetterContext)

  const peerIdRow = rowContentProps.find(row => row.columnName === 'peerId')
  const peerId = peerIdRow ? peerIdRow.value : null

  function mouseEnterHandler() {
    if (peerId !== globalPeerId) setPeerId(peerId)
  }
  function mouseLeaveHandler() {
    if (globalPeerId) setPeerId(null)
  }

  const highlighted = peerId === globalPeerId
  return (
    <DataTableRow
      rowContentProps={rowContentProps}
      columnDefs={columnDefs}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      highlighted={highlighted}
    />
  )
}

ConnectionsTableRow.propTypes = {
  rowContentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
}

export default ConnectionsTableRow
