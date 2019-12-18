function validateWidgetFields(widget) {
  const { name, Component, description, tags, screenshot, filterDefs } = widget

  if (!name || typeof name !== 'string')
    throw new Error(`Invalid widget name "${name}" (${typeof name})`)
  if (!Component || typeof Component !== 'function')
    throw new Error(
      `Invalid Component renderer for ${name} (${typeof Component})`
    )
  if (!description || typeof description !== 'string')
    throw new Error(
      `Invalid widget description "${description}" for ${name} (${typeof description})`
    )
  if (!tags || !Array.isArray(tags))
    throw new Error(`Invalid widget tags for ${name} (${typeof tags})`)

  if (filterDefs && !Array.isArray(filterDefs))
    throw new Error(
      `Invalid filter definitions for ${name} (${typeof filterDefs})`
    )

  return {
    name,
    Component,
    description,
    tags,
    screenshot,
    filterDefs,
  }
}

export { validateWidgetFields }
