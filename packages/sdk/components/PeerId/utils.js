function getTruncatedPeerId(peerId) {
  const truncationLength = 5
  return peerId.slice(peerId.length - truncationLength)
}

export { getTruncatedPeerId }
