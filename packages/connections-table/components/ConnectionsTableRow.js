import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import {
  DataTableRow,
  PeerContext,
  SetterContext,
  StyledButton,
  TableCell,
} from '@libp2p-observer/sdk'

import ConnectionsStreamsRow from './ConnectionsStreamsRow'

const ExpandStreamsCell = styled(TableCell)`
  padding-left: 0;
  padding-right: 0;
`

function ConnectionsTableRow({ rowContentProps, columnDefs }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const globalPeerId = useContext(PeerContext)
  const { setPeerId } = useContext(SetterContext)

  const streamsRow = rowContentProps.find(row => row.columnName === 'streams')
  const streamsCount = streamsRow ? streamsRow.value : null

  if (isExpanded) {
    const closeRow = () => setIsExpanded(false)
    return (
      <ConnectionsStreamsRow
        rowContentProps={rowContentProps}
        columnDefs={columnDefs}
        closeRow={closeRow}
        streamsCount={streamsCount}
      />
    )
  }

  const peerIdRow = rowContentProps.find(row => row.columnName === 'peerId')
  const peerId = peerIdRow ? peerIdRow.value : null

  function mouseEnterHandler() {
    if (peerId !== globalPeerId) setPeerId(peerId)
  }
  function mouseLeaveHandler() {
    if (globalPeerId) setPeerId(null)
  }

  const highlighted = peerId === globalPeerId
  const streamsButtonAction = streamsCount ? () => setIsExpanded(true) : null
  const streamsButtonText = streamsCount ? `Show streams` : 'No streams'

  return (
    <DataTableRow
      rowContentProps={rowContentProps}
      columnDefs={columnDefs}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      highlighted={highlighted}
    >
      <ExpandStreamsCell align="left">
        <StyledButton disabled={!streamsCount} onClick={streamsButtonAction}>
          {streamsButtonText}
        </StyledButton>
      </ExpandStreamsCell>
    </DataTableRow>
  )
}

ConnectionsTableRow.propTypes = {
  rowContentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
}

export default ConnectionsTableRow
