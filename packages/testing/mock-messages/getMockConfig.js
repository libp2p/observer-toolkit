// Minimal Configuration-message-like object with just the methods and properties
// needed to not crash when used in shell-based tests.
function getMockConfig({
  retentionPeriodMs = 120000,
  sendStateIntervalMs = 2000,
  ...props
} = {}) {
  return {
    getRetentionPeriodMs: () => retentionPeriodMs,
    getSendStateIntervalMs: () => sendStateIntervalMs,
    ...props,
  }
}

export default getMockConfig
