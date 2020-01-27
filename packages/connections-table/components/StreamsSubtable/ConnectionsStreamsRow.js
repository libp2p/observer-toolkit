import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon, TableCell, TableRow, TimeContext } from '@libp2p-observer/sdk'
import { getConnections } from '@libp2p-observer/data'
import StreamsSubtable from './StreamsSubtable'

const PushApart = styled.div`
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  margin: ${({ theme }) => theme.spacing()};
  align-items: center;
  justify-content: space-between;
`

const ExpandedRow = styled(TableRow)`
  background: none;
  border: solid 8px
    ${({ theme, highlighted }) =>
      highlighted
        ? theme.color('background', 2)
        : theme.color('background', 1)};
`

const ConnectionCell = styled(TableCell)`
  vertical-align: top;
  border: inherit;
`

const StreamsCell = styled(TableCell)`
  border: inherit;
  position: relative;
  vertical-align: top;
  padding: 0;
`

const Heading = styled.h3`
  ${({ theme }) => theme.text('heading', 'small')};
  color: ${({ theme }) => theme.color('highlight')};
`

const CloseIcon = styled.span``

function ConnectionsStreamsRow({
  peerId,
  streamsCount,
  rowContentProps,
  columnDefs,
  closeRow,
  onMouseEnter,
  onMouseLeave,
  highlighted,
}) {
  const timepoint = useContext(TimeContext)
  const connections = getConnections(timepoint)
  const connection = connections.find(conn => conn.getPeerId() === peerId)

  return (
    <ExpandedRow
      highlighted={highlighted}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ConnectionCell colSpan={2}>
        {columnDefs.map(({ renderContent, name, header }, cellIndex) => {
          const capitalisedInitial = header[0].toUpperCase() + header.slice(1)
          const labelId = `${name}_${cellIndex}_${peerId}`
          return (
            <PushApart key={name}>
              <label htmlFor={labelId}>{capitalisedInitial}:</label>
              <span id={labelId}>
                {renderContent(rowContentProps[cellIndex])}
              </span>
            </PushApart>
          )
        })}
      </ConnectionCell>
      <StreamsCell colSpan={columnDefs.length - 1}>
        <PushApart>
          <Heading>Connection has {streamsCount} streams:</Heading>
          <Icon
            aria-label="Close"
            type="cancel"
            active
            size="2.5em"
            onClick={closeRow}
            override={{ Container: CloseIcon }}
          />
        </PushApart>
        <StreamsSubtable connection={connection} />
      </StreamsCell>
    </ExpandedRow>
  )
}

ConnectionsStreamsRow.propTypes = {
  peerId: T.string.isRequired,
  streamsCount: T.number.isRequired,
  rowContentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
  closeRow: T.func.isRequired,
  onMouseEnter: T.func,
  onMouseLeave: T.func,
  highlighted: T.bool,
}

export default ConnectionsStreamsRow
