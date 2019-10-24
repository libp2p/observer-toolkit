function validateComponentFields(componentBundle) {
  const { name, Component, description, tags } = componentBundle

  if (!name || typeof name !== 'string')
    throw new Error(`Invalid component name "${name}" (${typeof name})`)
  if (!Component || typeof Component !== 'function')
    throw new Error(
      `Invalid Component renderer for ${name} (${typeof Component})`
    )
  if (!description || typeof description !== 'string')
    throw new Error(
      `Invalid component description "${description}" for ${name} (${typeof description})`
    )
  if (!tags || !Array.isArray(tags))
    throw new Error(`Invalid component tags for ${name} (${typeof tags})`)

  return {
    name,
    Component,
    description,
    tags,
  }
}
