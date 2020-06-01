import getStringSorter from './getStringSorter'

describe('getStringSorter', () => {
  it('asc sorts correctly', () => {
    expect(getStringSorter('asc')('a', 'b')).toEqual(-1)

    expect(getStringSorter('asc')('a', 'a')).toEqual(0)

    expect(getStringSorter('asc')('b', 'a')).toEqual(1)
  })

  it('desc sorts correctly', () => {
    expect(getStringSorter('desc')('a', 'b')).toEqual(1)

    expect(getStringSorter('desc')('a', 'a')).toEqual(-0)

    expect(getStringSorter('desc')('b', 'a')).toEqual(-1)
  })

  it('none sorts correctly', () => {
    expect(getStringSorter()('a', 'b')).toEqual(-1)

    expect(getStringSorter()('a', 'a')).toEqual(0)

    expect(getStringSorter()('b', 'a')).toEqual(1)
  })
})
