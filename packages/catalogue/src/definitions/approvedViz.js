import { validateComponentFields } from './utils'

import * as connectionsTable from '@libp2p-observer/connections-table'
import * as streamsTable from '@libp2p-observer/streams-table'

const approvedViz = [
  validateComponentFields(connectionsTable),
  validateComponentFields(streamsTable),
]

export default approvedViz
