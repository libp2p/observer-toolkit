import { validateWidgetFields } from './utils'

import * as connectionsTable from '@nearform/observer-connections-table'
import * as dhtBuckets from '@nearform/observer-dht-buckets'
import * as eventsTable from '@nearform/observer-events-table'
import * as streamsTable from '@nearform/observer-streams-table'

const approvedWidgets = [
  validateWidgetFields(connectionsTable),
  validateWidgetFields(dhtBuckets),
  validateWidgetFields(eventsTable),
  validateWidgetFields(streamsTable),
]

export default approvedWidgets
