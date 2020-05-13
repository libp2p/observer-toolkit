import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { DataTableRow, TableRow } from '@nearform/observer-sdk'

const EventsTableTr = styled(TableRow)`
  animation: 500ms ease-in 1 ${({ theme }) => theme.keyframes.fadeIn};
`

function EventsTableRow({
  rowIndex,
  changeHighlightedRowIndex,
  highlightedRowIndex,
  ...rowProps
}) {
  const isHighlighted = highlightedRowIndex === rowIndex
  const handleFocus = () => {
    changeHighlightedRowIndex(rowIndex)
  }

  return (
    <DataTableRow
      rowIndex={rowIndex}
      onMouseEnter={handleFocus}
      onFocus={handleFocus}
      highlighted={isHighlighted}
      override={{ TableRow: EventsTableTr }}
      {...rowProps}
    />
  )
}

EventsTableRow.propTypes = {
  rowIndex: T.number.isRequired,
  changeHighlightedRowIndex: T.func.isRequired,
  highlightedRowIndex: T.number,
}

export default EventsTableRow
