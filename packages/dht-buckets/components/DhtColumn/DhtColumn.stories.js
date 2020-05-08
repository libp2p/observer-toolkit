import React, { useContext } from 'react'
import T from 'prop-types'
import { storiesOf } from '@storybook/react'

import { TimeContext } from '@libp2p/observer-sdk'
import { getDhtBucketPeers, getTime } from '@libp2p/observer-data'

import DhtColumn from './DhtColumn'

function DhtColumnFixture({ bucketNum, title }) {
  const currentState = useContext(TimeContext)
  const peers = getDhtBucketPeers(bucketNum, currentState)
  const timestamp = getTime(currentState)

  return (
    <DhtColumn
      peers={peers}
      bucketNum={bucketNum}
      timestamp={timestamp}
      title={title}
    />
  )
}
DhtColumnFixture.propTypes = {
  bucketNum: T.number.isRequired,
  title: T.string,
}

storiesOf('DhtBuckets', module).add(
  'DhtColumn_0',
  () => <DhtColumnFixture bucketNum={0} title="Example title" />,
  { wrapper: 'shell' }
)

storiesOf('DhtBuckets', module).add(
  'DhtColumn_1',
  () => <DhtColumnFixture bucketNum={1} />,
  { wrapper: 'shell' }
)
