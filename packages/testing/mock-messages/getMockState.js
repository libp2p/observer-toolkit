// Minimal state-message-like object with just the methods and properties
// needed to not crash when used in shell-based tests
function getMockState({ start = null, duration = null, end = null, ...props } = {}) {
  return {
    getStartTs: () => start,
    getSnapshotDurationMs: () => duration,
    getInstantTs: () => end,
    ...props,
  }
}

export default getMockState
