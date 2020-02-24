import { validateWidgetFields } from './utils'

import * as connectionsTable from '@libp2p-observer/connections-table'
import * as streamsTable from '@libp2p-observer/streams-table'
import * as dhtBuckets from '@libp2p-observer/dht-buckets'

const approvedWidgets = [
  validateWidgetFields(connectionsTable),
  validateWidgetFields(streamsTable),
  validateWidgetFields(dhtBuckets),
]

export default approvedWidgets
