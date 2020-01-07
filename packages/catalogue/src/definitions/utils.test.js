import * as utils from './utils'

describe('validateWidgetFields only allows valid component fields in supplied object', () => {
  const valid = {
    name: 'validName',
    Widget: () => {},
    description: 'valid',
    tags: [],
  }

  it('passes with all valid fields', () => {
    expect(() => utils.validateWidgetFields(valid)).not.toThrow()
  })

  it('throws if component bundle is undefined', () => {
    expect(() => utils.validateWidgetFields()).toThrow(
      new Error(
        'Invalid widget type, must be an object with properties `name`, `Widget`, `description`, `tags` and optionally `screenshot`'
      )
    )
  })

  it('throws if name is not supplied', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, name: undefined })
    ).toThrow(new Error('Invalid widget name "undefined" (undefined)'))
  })
  it('throws if name is not a string', () => {
    expect(() => utils.validateWidgetFields({ ...valid, name: 123 })).toThrow(
      new Error('Invalid widget name "123" (number)')
    )
  })

  it('throws if Widget is not supplied', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, Widget: undefined })
    ).toThrow(new Error('Invalid Widget renderer for validName (undefined)'))
  })
  it('throws if Widget is not a function', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, Widget: 'invalid' })
    ).toThrow(new Error('Invalid Widget renderer for validName (string)'))
  })

  it('throws if description is not supplied', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, description: undefined })
    ).toThrow(
      new Error(
        'Invalid widget description "undefined" for validName (undefined)'
      )
    )
  })
  it('throws if description is not a string', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, description: 123 })
    ).toThrow(
      new Error('Invalid widget description "123" for validName (number)')
    )
  })

  it('throws if tags is not supplied', () => {
    expect(() =>
      utils.validateWidgetFields({ ...valid, tags: undefined })
    ).toThrow(new Error('Invalid widget tags for validName (undefined)'))
  })
  it('throws if tags is not an array', () => {
    expect(() => utils.validateWidgetFields({ ...valid, tags: 123 })).toThrow(
      new Error('Invalid widget tags for validName (number)')
    )
  })
})
