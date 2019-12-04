import { validateComponentFields } from './utils'

import * as connectionsTable from '@libp2p-observer/connections-table'

const approvedViz = [
  validateComponentFields(connectionsTable),
  //  validateComponentFields(streamsTable),
]

export default approvedViz
