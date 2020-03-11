function parseJsonString(content) {
  try {
    const json = JSON.parse(content)
    const items = Object.keys(json)
      .sort()
      .map(key => {
        const value =
          typeof json[key] === 'string' ||
          typeof json[key] === 'number' ||
          typeof json[key] === 'boolean'
            ? json[key]
            : typeof json[key]

        return {
          key,
          value,
        }
      })
    return items
  } catch (error) {
    console.warn('ERROR CAUGHT', { content, error })
    return []
  }
}

export default parseJsonString
