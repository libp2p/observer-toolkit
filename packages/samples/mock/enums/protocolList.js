'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

const protocolList = new EnumWithFrequency([
  [0, '/ipfs/id/1.0.0', 10],
  [1, '/ipfs/id/push/1.0.0', 8],
  [2, '/ipfs/id/push/1.0.1', 2],
  [3, '/p2p/id/delta/1.0.0', 10],
  [4, '/ipfs/ping/1.0.0', 20],
  [5, '/libp2p/circuit/relay/0.1.0', 15],
  [6, '/libp2p/circuit/relay/0.2.0', 5],
  [7, '/libp2p/circuit/relay/0.2.2', 5],
  [8, '/meshsub/1.0.0', 3],
  [9, '/floodsub/1.0.0', 16],
  [10, '/taipei/chat/2019', 3],
  [11, '/taipei/chat/2019', 1],
])

module.exports = { protocolList }
