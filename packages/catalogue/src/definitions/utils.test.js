import * as utils from './utils'

describe('validateWidgetFields only allows valid component fields in supplied object', () => {
  const valid = {
    name: 'validName',
    Component: () => {},
    description: 'valid',
    tags: [],
  }

  it('passes with all valid fields', () => {
    expect(() => utils.validateWidgetFields(valid)).not.toThrow()
  })

  it('throws if component bundle is undefined', () => {
    expect(() => utils.validateWidgetFields()).toThrow(
      new Error(
        'Invalid component type, must be an object with properties `name`, `Component`, `description`, `tags` and optionally `screenshot`'
      )
    )
  })

  it('throws if name is not supplied', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, name: undefined })
    ).toThrow(new Error('Invalid component name "undefined" (undefined)'))
  })
  it('throws if name is not a string', () => {
    expect(() => utils.validateWidgetFields({ ...valid, name: 123 })).toThrow(
      new Error('Invalid component name "123" (number)')
    )
  })

  it('throws if Component is not supplied', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, Component: undefined })
    ).toThrow(new Error('Invalid Component renderer for validName (undefined)'))
  })
  it('throws if Component is not a function', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, Component: 'invalid' })
    ).toThrow(new Error('Invalid Component renderer for validName (string)'))
  })

  it('throws if description is not supplied', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, description: undefined })
    ).toThrow(
      new Error(
        'Invalid component description "undefined" for validName (undefined)'
      )
    )
  })
  it('throws if description is not a string', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, description: 123 })
    ).toThrow(
      new Error('Invalid component description "123" for validName (number)')
    )
  })

  it('throws if tags is not supplied', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, tags: undefined })
    ).toThrow(new Error('Invalid component tags for validName (undefined)'))
  })
  it('throws if tags is not an array', () => {
    expect(() => utils.validateWidgetFields({ ...valid, tags: 123 })).toThrow(
      new Error('Invalid component tags for validName (number)')
    )
  })
})
