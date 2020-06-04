// Minimal Configuration-message-like object with just the methods and properties
// needed to not crash when used in shell-based tests.
function getMockConfig({
  retentionPeriodMs = 120000,
  stateSnapshotIntervalMs = 2000,
  ...props
} = {}) {
  return {
    getRetentionPeriodMs: () => retentionPeriodMs,
    getStateSnapshotIntervalMs: () => stateSnapshotIntervalMs,
    ...props,
  }
}

export default getMockConfig
