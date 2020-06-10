function getTruncatedPeerId(peerId) {
  const truncationLength = 8
  return peerId.slice(0, truncationLength)
}

export { getTruncatedPeerId }
