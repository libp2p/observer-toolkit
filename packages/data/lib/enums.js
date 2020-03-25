'use strict'

// If needed, this could be optimised to convert each enum once on export instead of on each call
function getEnumByName(name, obj) {
  const entry = Object.entries(obj).find(([_, value]) => value === name)
  if (!entry)
    throw new Error(`"${name}" not one of "${Object.values(obj).join('", "')}"`)
  return parseInt(entry[0])
}

// TODO: rename to something specific to connections
const statusNames = {
  0: 'ACTIVE',
  1: 'CLOSED',
  2: 'OPENING',
  3: 'CLOSING',
  4: 'ERROR',
}

const roleNames = {
  0: 'INITIATOR',
  1: 'RESPONDER',
}

// TODO: Get this dynamically from data source
const transportNames = {
  0: 'TCP',
  1: 'UDP',
  2: 'QUIC',
  3: 'RDP',
}

const dhtStatusNames = {
  0: 'ACTIVE',
  1: 'MISSING',
  2: 'REJECTED',
  3: 'CANDIDATE',
}

const dhtQueryResultNames = {
  0: 'SUCCESS',
  1: 'ERROR',
  2: 'TIMEOUT',
  3: 'PENDING',
}

const dhtQueryDirectionNames = {
  0: 'INBOUND',
  1: 'OUTBOUND',
}

const dhtQueryEventNames = {
  0: 'InboundDHTQuery',
  1: 'OutboundDHTQuery',
}

module.exports = {
  getEnumByName,
  dhtStatusNames,
  statusNames,
  roleNames,
  transportNames,
  dhtQueryResultNames,
  dhtQueryDirectionNames,
  dhtQueryEventNames,
}
