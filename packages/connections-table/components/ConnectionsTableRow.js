import React, { useContext } from 'react'
import T from 'prop-types'
import { DataTableRow, PeerContext, SetterContext } from 'sdk'

function ConnectionsTableRow({ rowContentProps, columnDefs }) {
  const globalPeerId = useContext(PeerContext)
  const { setPeerId } = useContext(SetterContext)

  const peerId = rowContentProps[0].value

  function mouseEnterHandler() {
    if (peerId !== globalPeerId) setPeerId(peerId)
  }
  function mouseLeaveHandler() {
    if (globalPeerId) setPeerId(null)
  }

  return (
    <DataTableRow
      rowContentProps={rowContentProps}
      columnDefs={columnDefs}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      highlighted={peerId === globalPeerId}
    />
  )
}

ConnectionsTableRow.propTypes = {
  rowContentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
}

export default ConnectionsTableRow
