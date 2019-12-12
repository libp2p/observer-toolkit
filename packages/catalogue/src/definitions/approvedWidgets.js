import { validateWidgetFields } from './utils'

import * as connectionsTable from '@libp2p-observer/connections-table'
import * as streamsTable from '@libp2p-observer/streams-table'

const approvedWidgets = [
  validateWidgetFields(connectionsTable),
  validateWidgetFields(streamsTable),
]

export default approvedWidgets
