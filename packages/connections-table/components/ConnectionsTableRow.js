import React, { useContext } from 'react'
import T from 'prop-types'
import { DataTableRow, PeerContext, SetterContext } from 'sdk'

function ConnectionsTableRow({ row, columns }) {
  const globalPeerId = useContext(PeerContext)
  const { setPeerId } = useContext(SetterContext)

  const peerId = row[0].peerId

  function mouseEnterHandler() {
    if (peerId !== globalPeerId) setPeerId(peerId)
  }
  function mouseLeaveHandler() {
    if (globalPeerId) setPeerId(null)
  }

  return (
    <DataTableRow
      row={row}
      columns={columns}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      highlighted={peerId === globalPeerId}
    />
  )
}

ConnectionsTableRow.propTypes = {
  row: T.array.isRequired,
  columns: T.array.isRequired,
}

export default ConnectionsTableRow
