// Minimal runtime-message-like object with just the methods and properties
// needed to not crash when used in shell-based tests.
function getMockRuntime({
  peerId = '75171c9d7b5b5b99d6d93aaaa2e802dc9473369e41a323a0c1020837180ba20b',
  keepStaleDataMs = 120000,
  sendStateIntervalMs = 2000,
  eventTypesList = [],
  ...props
} = {}) {
  return {
    getPeerId: () => peerId,
    getKeepStaleDataMs: () => keepStaleDataMs,
    getSendStateIntervalMs: () => sendStateIntervalMs,
    getEventTypesList: () => [],
    ...props,
  }
}

export default getMockRuntime
