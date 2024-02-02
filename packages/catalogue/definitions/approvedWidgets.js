import { validateWidgetFields } from './utils'

import * as connectionsTable from '@libp2p/observer-connections-table'
import * as dhtBuckets from '@libp2p/observer-dht-buckets'
import * as dhtQueries from '@libp2p/observer-dht-queries'
import * as eventsTable from '@libp2p/observer-events-table'
import * as streamsTable from '@libp2p/observer-streams-table'

const approvedWidgets = [
  validateWidgetFields(connectionsTable),
  validateWidgetFields(dhtBuckets),
  validateWidgetFields(dhtQueries),
  validateWidgetFields(eventsTable),
  validateWidgetFields(streamsTable),
]

export default approvedWidgets
