// Minimal ServerResponse-message-like object with just the methods and properties
// needed to not crash when used in shell-based tests.
import getMockConfig from './getMockConfig'
let commandId = 0

function getMockResponse({
  id,
  effectiveConfig,
  error = null,
  result = error ? 1 : 0,
} = {}) {
  if (id === undefined) {
    id = commandId
    commandId++
  }

  const mockConfig = getMockConfig(effectiveConfig)

  return {
    getEffectiveConfig: () => mockConfig,
    getId: () => id,
    getError: () => error,
    getResult: () => result,
  }
}

export default getMockResponse
