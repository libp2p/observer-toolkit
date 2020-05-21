function validateWidgetFields(widget) {
  if (!widget || typeof widget !== 'object')
    throw new Error(
      'Invalid widget type, must be an object with properties `name`, `Widget`, `description`, `tags` and optionally `screenshot`'
    )

  const { name, Widget, description, tags, screenshot } = widget

  if (!name || typeof name !== 'string')
    throw new Error(`Invalid widget name "${name}" (${typeof name})`)
  if (!Widget || typeof Widget !== 'function')
    throw new Error(`Invalid Widget renderer for ${name} (${typeof Widget})`)
  if (!description || typeof description !== 'string')
    throw new Error(
      `Invalid widget description "${description}" for ${name} (${typeof description})`
    )
  if (!tags || !Array.isArray(tags))
    throw new Error(`Invalid widget tags for ${name} (${typeof tags})`)

  return {
    name,
    Widget,
    description,
    tags,
    screenshot,
  }
}

export { validateWidgetFields }
