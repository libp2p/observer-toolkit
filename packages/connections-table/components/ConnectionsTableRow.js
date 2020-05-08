import React, { useContext } from 'react'
import T from 'prop-types'
import { DataTableRow, PeersContext, SetterContext } from '@libp2p/observer-sdk'

function ConnectionsTableRow({ rowContent, ...rowProps }) {
  const globalPeerIds = useContext(PeersContext)
  const { setPeerIds } = useContext(SetterContext)
  const peerIdRow = rowContent.find(row => row.columnName === 'peerId')
  const peerId = peerIdRow ? peerIdRow.value : null
  const isHighlighted = globalPeerIds.includes(peerId)

  function mouseEnterHandler() {
    if (!globalPeerIds.includes(peerId)) setPeerIds([peerId])
  }
  function mouseLeaveHandler() {
    if (globalPeerIds.length) setPeerIds([])
  }

  return (
    <DataTableRow
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      highlighted={isHighlighted}
      rowContent={rowContent}
      {...rowProps}
    />
  )
}

ConnectionsTableRow.propTypes = {
  rowContent: T.array.isRequired,
}

export default ConnectionsTableRow
