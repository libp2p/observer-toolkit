import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import {
  DataTableRow,
  Icon,
  PeerContext,
  SetterContext,
  StyledButton,
  TableCell,
} from '@libp2p-observer/sdk'

import ConnectionsStreamsRow from './StreamsSubtable/ConnectionsStreamsRow'

const ExpandIcon = styled.span`
  transform: rotate(90deg);
  margin-right: ${({ theme }) => theme.spacing(-1)};
`

const ExpandStreamsCell = styled(TableCell)`
  padding-left: 0;
  padding-right: 0;
`

function ConnectionsTableRow({ rowContentProps, columnDefs, ...rowProps }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const globalPeerId = useContext(PeerContext)
  const { setPeerId } = useContext(SetterContext)
  const peerIdRow = rowContentProps.find(row => row.columnName === 'peerId')
  const peerId = peerIdRow ? peerIdRow.value : null
  const isHighlighted = peerId === globalPeerId

  function mouseEnterHandler() {
    if (peerId !== globalPeerId) setPeerId(peerId)
  }
  function mouseLeaveHandler() {
    if (globalPeerId) setPeerId(null)
  }

  const streamsRow = rowContentProps.find(row => row.columnName === 'streams')
  const streamsCount = streamsRow ? streamsRow.value : null

  if (isExpanded) {
    const closeRow = () => setIsExpanded(false)
    return (
      <ConnectionsStreamsRow
        peerId={peerId}
        rowContentProps={rowContentProps}
        columnDefs={columnDefs}
        closeRow={closeRow}
        streamsCount={streamsCount}
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
        highlighted={isHighlighted}
      />
    )
  }

  const streamsButtonAction = streamsCount ? () => setIsExpanded(true) : null
  const streamsButtonText = streamsCount ? `View streams` : 'No streams'

  return (
    <DataTableRow
      rowContentProps={rowContentProps}
      columnDefs={columnDefs}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      highlighted={isHighlighted}
      {...rowProps}
    >
      <ExpandStreamsCell align="left">
        <StyledButton disabled={!streamsCount} onClick={streamsButtonAction}>
          {streamsButtonText}
          {streamsCount && (
            <Icon type="expand" override={{ Container: ExpandIcon }} />
          )}
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
