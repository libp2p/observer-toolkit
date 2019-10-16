'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')

// Transports should have properties including:
// - bool `listening`
// - bool `dialing`
// - arr `listen_multiaddrs`
// - func `canHandlePeer`
// ...stored on the swarm, but it's not clear yet how this can
// be accessed between restarts when all we have saved is the id
// https://github.com/libp2p/notes/pull/9/files#diff-cc9591d16a1c883dcd9fc0592fdba4e2R49

// For now, just enumerate some typical names
const transportList = new EnumWithFrequency([
  [0, 'TCP', 60],
  [1, 'UDP', 20],
  [2, 'QUIC', 12],
  [3, 'RDP', 8],
])

module.exports = { transportList }
