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

module.exports = {
  statusNames,
  roleNames,
  transportNames,
}
