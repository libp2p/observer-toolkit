import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon, TableCell, TableRow } from '@libp2p-observer/sdk'

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
  streamsCount,
  rowContentProps,
  columnDefs,
  closeRow,
  onMouseEnter,
  onMouseLeave,
  highlighted,
}) {
  return (
    <ExpandedRow
      highlighted={highlighted}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ConnectionCell colSpan={2}>
        {columnDefs.map(({ renderContent, name }, cellIndex) => (
          <PushApart key={name}>
            <label>{name}:</label>
            {renderContent(rowContentProps[cellIndex])}
          </PushApart>
        ))}
      </ConnectionCell>
      <StreamsCell colSpan={columnDefs.length - 1}>
        <PushApart>
          <Heading>Connection has {streamsCount} streams:</Heading>
          <Icon
            type="cancel"
            active
            size="2.5em"
            onClick={closeRow}
            override={{ Container: CloseIcon }}
          />
        </PushApart>
      </StreamsCell>
    </ExpandedRow>
  )
}

ConnectionsStreamsRow.propTypes = {
  rowContentProps: T.array.isRequired,
  columnDefs: T.array.isRequired,
}

export default ConnectionsStreamsRow
