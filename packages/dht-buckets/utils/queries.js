function getQueryTimesByPeer({
  queriesByPeerId,
  peerIds = Object.keys(queriesByPeerId),
  direction,
  timeNow,
}) {
  const queries = peerIds.reduce((queries, peerId) => {
    const peerQueries = queriesByPeerId[peerId]
    if (!peerQueries) return queries

    const targetQueries = direction
      ? peerQueries[direction]
      : [...peerQueries.INBOUND, ...peerQueries.OUTBOUND]

    const processedQueries = targetQueries.map(query => ({
      elapsed: timeNow - query.start,
      peerId: peerId,
    }))
    return [...queries, ...processedQueries]
  }, [])

  return queries
}

export { getQueryTimesByPeer }
