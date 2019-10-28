import { validateComponentFields } from './utils'

import * as connectionsTable from 'connections-table'
import * as streamsTable from 'streams-table'

const approvedViz = [
  validateComponentFields(connectionsTable),
  validateComponentFields(streamsTable),
]

export default approvedViz
