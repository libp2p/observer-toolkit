import * as connectionsTable from '@libp2p/observer-connections-table'
import * as dhtBuckets from '@libp2p/observer-dht-buckets'
import * as dhtQueries from '@libp2p/observer-dht-queries'
import * as eventsTable from '@libp2p/observer-events-table'
import * as streamsTable from '@libp2p/observer-streams-table'

export default [
  connectionsTable,
  dhtBuckets,
  dhtQueries,
  eventsTable,
  streamsTable,
]
