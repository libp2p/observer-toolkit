import { validateWidgetFields } from './utils'

import * as connectionsTable from '@libp2p-observer/connections-table'
import * as streamsTable from '@libp2p-observer/streams-table'
import * as dhtBuckets from '@libp2p-observer/dht-buckets'
import * as eventsTable from '@libp2p-observer/events-table'

const approvedWidgets = [
  validateWidgetFields(connectionsTable),
  validateWidgetFields(streamsTable),
  validateWidgetFields(dhtBuckets),
  validateWidgetFields(eventsTable),
]

export default approvedWidgets
