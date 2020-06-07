import React, { useEffect, useRef, useState } from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'

import { DataDemoWrapper } from '@nearform/observer-testing'

import DhtPeer from './DhtPeer'

const Spacer = styled.div`
  margin: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) => theme.color('tertiary', 3)};
`

const initialAge = 7000

const mapQueryTimes = time => ({ sentTs: time })
const inboundQueries = [
  1000,
  1800,
  4000,
  3950,
  4100,
  4300,
  4550,
  4850,
  7000,
].map(mapQueryTimes)

const outboundQueries = [200, 1600, 1100, 6500, 7300, 7700, 8100, 8400].map(
  mapQueryTimes
)

const peerIdA = 'a'.repeat(64)
const peerIdB = 'b'.repeat(64)

function DhtPeerFixture() {
  const [timestamp, setTimestamp] = useState(0)
  const slotRefA = useRef()
  const slotRefB = useRef()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(timestamp + 1000)
    }, 1000)

    if (timestamp >= 20000) clearInterval(interval)

    return () => {
      clearInterval(interval)
    }
  })

  return (
    <DataDemoWrapper>
      <Spacer>
        <DhtPeer
          key={peerIdA}
          peerId={peerIdA}
          status="ACTIVE"
          inboundQueries={inboundQueries}
          outboundQueries={outboundQueries}
          timestamp={timestamp}
          age={initialAge + timestamp}
          slotRef={slotRefA}
          previousSlotRef={slotRefA}
          showDistance={true}
        />
      </Spacer>
      <Spacer>
        <DhtPeer
          key={peerIdB}
          peerId={peerIdB}
          status="MISSING"
          inboundQueries={inboundQueries}
          outboundQueries={outboundQueries}
          timestamp={timestamp}
          slotRef={slotRefB}
          previousSlotRef={slotRefB}
          age={initialAge + timestamp}
        />
      </Spacer>
    </DataDemoWrapper>
  )
}

storiesOf('DhtBuckets', module).add('DhtPeer', () => <DhtPeerFixture />, {
  wrapper: 'data',
})
