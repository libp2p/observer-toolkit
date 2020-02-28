import { validateWidgetFields } from './utils'

import * as connectionsTable from '@libp2p-observer/connections-table'
import * as streamsTable from '@libp2p-observer/streams-table'
import * as eventsTable from '@libp2p-observer/events-table'

const approvedWidgets = [
  validateWidgetFields(connectionsTable),
  validateWidgetFields(streamsTable),
  validateWidgetFields(eventsTable),
]

export default approvedWidgets
