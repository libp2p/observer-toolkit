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
  border-top: 4px solid ${({ theme }) => theme.color('background', 1)};
  border-bottom: 4px solid ${({ theme }) => theme.color('background', 1)};
`

const ConnectionCell = styled(TableCell)`
  border: 4px solid ${({ theme }) => theme.color('primary', 0, 0.1)};
`

const StreamsCell = styled(TableCell)`
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
}) {
  return (
    <ExpandedRow>
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
