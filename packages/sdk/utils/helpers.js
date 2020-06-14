function copyToClipboard(text) {
  // TODO: expand this and include a toast notice on success
  navigator.clipboard.writeText(text)
}

function calculatableProp(prop, allowUndefined = false) {
  // Handle and validate props that may be numbers or functions returning a number
  if (allowUndefined && prop === undefined) return prop
  const num = typeof prop === 'function' ? prop() : prop
  throwIf(isNotNumeric(num, 'calculatableProp'))
  return num
}

function getMinMaxValues(numericData) {
  const { min, max } = numericData.reduce(
    ({ min, max }, num) => {
      return { min: Math.min(min, num), max: Math.max(max, num) }
    },
    { min: Infinity, max: -Infinity }
  )
  return { min, max }
}

function tweenValues(before, after, tweenPosition) {
  const diff = after - before
  return before + diff * tweenPosition
}

function isInsideRect(pointer, rect) {
  return (
    pointer.x >= rect.x &&
    pointer.x <= rect.x + rect.width &&
    pointer.y >= rect.y &&
    pointer.y <= rect.y + rect.height
  )
}

function isNotNumeric(value, name = 'Value') {
  // Return throwable error message if NaN or non-number
  return isNaN(value)
    ? `${name} is not numeric, is ${typeof value} (${value})`
    : false
}

function throwIf(errorMsg) {
  if (errorMsg && typeof errorMsg === 'string') throw new Error(errorMsg)
  if (Array.isArray(errorMsg) && errorMsg.length)
    throw new Error(errorMsg.join('\n\n '))
}

// d3 data processors can fail very late if NaN or similar creep in.
// Use this to fail early in memoised or non-perf-intensive functions.
function validateNumbers(obj) {
  const errors = Object.entries(obj).reduce((errors, [key, num]) => {
    const errorMsg = isNotNumeric(num, key)
    return errorMsg ? [...errors, errorMsg] : errors
  }, [])
  throwIf(errors)
}

export {
  calculatableProp,
  copyToClipboard,
  isNotNumeric,
  throwIf,
  getMinMaxValues,
  tweenValues,
  isInsideRect,
  validateNumbers,
}
