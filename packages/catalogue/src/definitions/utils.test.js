import * as utils from './utils'

describe('validateComponentFields only allows valid component fields in supplied object', () => {
  const valid = {
    name: 'validName',
    Component: () => {},
    description: 'valid',
    tags: [],
  }

  it('passes with all valid fields', () => {
    expect(() => utils.validateComponentFields(valid)).not.toThrow()
  })

  it('throws if component bundle is undefined', () => {
    expect(() => utils.validateComponentFields()).toThrow(
      new Error(
        'Invalid component type, must be an object with properties `name`, `Component`, `description`, `tags` and optionally `screenshot`'
      )
    )
  })

  it('throws if name is not supplied', () => {
    expect(() =>
      utils.validateComponentFields({ ...valid, name: undefined })
    ).toThrow(new Error('Invalid component name "undefined" (undefined)'))
  })
  it('throws if name is not a string', () => {
    expect(() =>
      utils.validateComponentFields({ ...valid, name: 123 })
    ).toThrow(new Error('Invalid component name "123" (number)'))
  })

  it('throws if Component is not supplied', () => {
    expect(() =>
      utils.validateComponentFields({ ...valid, Component: undefined })
    ).toThrow(new Error('Invalid Component renderer for validName (undefined)'))
  })
  it('throws if Component is not a function', () => {
    expect(() =>
      utils.validateComponentFields({ ...valid, Component: 'invalid' })
    ).toThrow(new Error('Invalid Component renderer for validName (string)'))
  })

  it('throws if description is not supplied', () => {
    expect(() =>
      utils.validateComponentFields({ ...valid, description: undefined })
    ).toThrow(
      new Error(
        'Invalid component description "undefined" for validName (undefined)'
      )
    )
  })
  it('throws if description is not a string', () => {
    expect(() =>
      utils.validateComponentFields({ ...valid, description: 123 })
    ).toThrow(
      new Error('Invalid component description "123" for validName (number)')
    )
  })

  it('throws if tags is not supplied', () => {
    expect(() =>
      utils.validateComponentFields({ ...valid, tags: undefined })
    ).toThrow(new Error('Invalid component tags for validName (undefined)'))
  })
  it('throws if tags is not an array', () => {
    expect(() =>
      utils.validateComponentFields({ ...valid, tags: 123 })
    ).toThrow(new Error('Invalid component tags for validName (number)'))
  })
})
