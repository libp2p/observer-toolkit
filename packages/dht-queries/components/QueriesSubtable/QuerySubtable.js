import React, { useState } from 'react'
import Modal from 'react-modal'
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
} from 'react-vis'

import T from 'prop-types'
import styled from 'styled-components'

import { DataTable, useTabularData, Tooltip, Icon } from '@libp2p/observer-sdk'
import queryColumnDefs from '../../definitions/queryColumns'

const Container = styled.div`
  display: block;
  padding: ${({ theme }) => theme.spacing([1, 0.5])};
`
const Graph = styled.div`
  padding: 20px;
`

const CloseButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  border-radius: 50%;
  color: ${({ theme }) => theme.color('highlight', 1)};
  ${({ theme }) => theme.text('label', 'medium')} :hover,
  :focus {
    background: ${({ theme }) => theme.color('highlight', 0)};
    color: ${({ theme }) => theme.color('background', 0)};
  }
`

const TooltipContent = styled.div`
  color: ${({ theme }) => theme.color('highlight', 1)};
  white-space: nowrap;
`

function QuerySubTable({ lookup }) {
  const queryList = lookup.getQueriesList()
  const queriesArray = queryList.map(q => ({
    target: q.getTarget(),
    start: q.getStartTs(),
    end: q.getEndTs(),
    closerPeers: q.getPeerIdList(),
    status: q.getStatus(),
    distance: q.getDistance(),
  }))
  const firstLookUp = queriesArray.reduce((prev, curr) =>
    prev.start < curr.start ? prev : curr
  )
  const startTime = firstLookUp.start

  const data = queriesArray.map(q => (
    <LineSeries
      data={[
        { x: q.start - startTime, y: q.distance },
        { x: q.end - startTime, y: q.distance },
      ]}
    />
  ))

  const {
    columnDefs,
    allContent,
    shownContent,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    setRange,
    rowCounts,
  } = useTabularData({
    columns: queryColumnDefs,
    data: queryList,
    defaultSort: 'open',
  })

  const [open, setOpen] = useState(true)

  const closeModal = () => {
    setOpen(!open)
  }

  return (
    <div>
      <Modal isOpen={open} contentLabel="DHT Queries">
        <CloseButton>
          <Tooltip
            side="left"
            fixOn="never"
            toleranceY={null}
            content={
              <TooltipContent>
                Close and return <br /> to Lookups
              </TooltipContent>
            }
          >
            <Icon
              aria-label="Close"
              type="cancel"
              onClick={closeModal}
              size={'3em'}
            />
          </Tooltip>
        </CloseButton>
        <Container>
          <DataTable
            allContent={allContent}
            shownContent={shownContent}
            columnDefs={columnDefs}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            setRange={setRange}
            rowCounts={rowCounts}
            hasSlidingRows={false}
          />
          <Graph>
            <XYPlot width={1100} height={850}>
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis
                title="milliseconds since start"
                position="middle"
                tickTotal={20}
              />
              <YAxis
                title="distance to target"
                position="middle"
                tickTotal={20}
              />
              {data}
            </XYPlot>
          </Graph>
        </Container>
      </Modal>
    </div>
  )
}

QuerySubTable.propTypes = {
  lookup: T.object,
}

export default QuerySubTable
