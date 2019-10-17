// Temporary function for temp tooltip placeholder - flattens jsx-ified template strings
// Remove this as soon as it's not needed
function childrenToString(children) {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.join('')
  if (!children) return ''
}

export {
  childrenToString
}
