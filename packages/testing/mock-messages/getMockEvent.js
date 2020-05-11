// Minimal event-message-like object with just the methods and properties
// needed to not crash when used in shell-based tests
function getMockEvent({ time = null, type = null, content = '{}', ...props } = {}) {
  return {
    getTs: () => time,
    getType: () => type,
    getContent: () => content,
    ...props,
  }
}

export default getMockEvent
