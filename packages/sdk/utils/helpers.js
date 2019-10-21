// Temporary function for temp tooltip placeholder - flattens jsx-ified template strings
// Remove this as soon as it's not needed
function childrenToString(children) {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.join('')
  if (!children) return ''
}

// d3 data processors can fail very late if NaN or similar creep in.
// Use this to fail early in memoised or non-perf-intensive functions.
function validateNumbers(obj) {
  const errors = Object.entries(obj).reduce(
    (errors, [key, num]) =>
      isNaN(num)
        ? [...errors, `${key} is not numeric, is ${typeof num}: ${num}`]
        : errors,
    []
  )

  if (errors.length) throw new Error(errors.join('\n\n '))
}

export { childrenToString, validateNumbers }
