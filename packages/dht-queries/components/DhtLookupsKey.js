import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { RuntimeContext } from '@libp2p/observer-sdk'

import { slotSize, borderWidth } from '../utils/constants'

const Container = styled.div`
  background: ${({ theme }) => theme.color('background')};
  display: flex;
  flex-direction: row;
  justify-content: start;
  color: ${({ theme }) => theme.color('text', 1)};
  ${({ theme }) => theme.text('body', 'small')};
  align-items: center;
`

const Segment = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  padding: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.color('text', 1)};
  align-items: center;
`

const KeyHeading = styled.h3`
  color: ${({ theme }) => theme.color('tertiary', 3)};
  ${({ theme }) => theme.text('heading', 'small')};
`

const SegmentLabel = styled.label`
  color: ${({ theme }) => theme.color('text', 1)};
  ${({ theme }) => theme.text('heading', 'small')};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const Item = styled.div`
  margin-right: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`

const OuterSlot = styled.div`
  background: ${({ theme, isEmpty }) => theme.color('tertiary', 2)};
  padding: ${({ theme }) => theme.spacing(0.5)};
  margin: ${({ theme }) => theme.spacing(0.5)};
  width: ${({ theme }) => theme.spacing(1, true) + slotSize}px;
  height: ${({ theme }) => theme.spacing(1, true) + slotSize}px;
`

const Slot = styled.div`
  position: relative;
  border-width: ${borderWidth}px;
  border-style: solid;
  width: ${slotSize - 2 * borderWidth}px;
  height: ${slotSize - 2 * borderWidth}px;
  border-color: ${({ theme, isEmpty, isSelected }) =>
    theme.color('background', 1, isEmpty ? 0.2 : 0)};
  background: ${({ theme, isEmpty }) =>
    isEmpty ? theme.color('tertiary', 3) : theme.color('contrast', 0, 0.25)};
`

const queryTimes = [100, 200, 300, 400, 500, 600, 700, 800, 900].map(time => ({
  sentTs: time,
}))
const timestamp = 6000

function DhtLookupsKey() {
  const runtime = useContext(RuntimeContext)
  const peerId = runtime.getPeerId()
  return (
    <Container>
      <Segment>
        <KeyHeading>Kad dht Lookups</KeyHeading>
      </Segment>
    </Container>
  )
}

DhtLookupsKey.propTypes = {
  children: T.node,
}

export default DhtLookupsKey
