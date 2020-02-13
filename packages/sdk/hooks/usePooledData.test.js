import {} from 'react'

import usePooledData from './usePooledData'

const data = [
  { a: -5.4, b: 12 },
  { a: -1.9, b: 5 },
  { a: -1.1, b: 14 },
  { a: -0.9, b: 3 },
  { a: 0.0, b: 16 },
  { a: 0.6, b: 1 },
  { a: 1.1, b: 18 },
  { a: 1.7, b: 9 },
  { a: 2.2, b: 10 },
  { a: 2.6, b: 7 },
  { a: 3.3, b: 12 },
  { a: 3.5, b: 5 },
  { a: 3.8, b: 14 },
  { a: 4.0, b: 3 },
  { a: 4.1, b: 16 },
  { a: 4.2, b: 1 },
  { a: 4.2, b: 18 },
  { a: 4.3, b: 9 },
  { a: 4.3, b: 10 },
  { a: 4.4, b: 7 },
  { a: 4.5, b: 12 },
  { a: 4.7, b: 5 },
  { a: 5.1, b: 14 },
  { a: 5.3, b: 3 },
  { a: 5.5, b: 16 },
  { a: 5.8, b: 1 },
  { a: 6.3, b: 18 },
  { a: 7.4, b: 9 },
  { a: 9.1, b: 10 },
  { a: 10.0, b: 7 },
].map(({ a, b }) => ({ a, b, c: a * b, d: Math.pow(b, a) }))

describe('usePooledData hook', () => {
  it('Gives reasonable buckets when given just a simple array', () => {
    const { pooledData, pools } = usePooledData({
      data: data.map(datum => datum.a),
    })
    expect(pooledData).toHaveLength(pools.length)

    const expectedPools = [
      { min: -6, max: -4 },
      { min: -4, max: -2 },
      { min: -2, max: 0 },
      { min: 0, max: 2 },
      { min: 2, max: 4 },
      { min: 4, max: 6 },
      { min: 6, max: 8 },
      { min: 8, max: 10 },
    ]
    expect(pools).toEqual(expectedPools)

    const expectedPooledData = [1, 0, 3, 5, 5, 13, 2, 2]
    expect(pooledData).toEqual(expectedPooledData)
  })

  it('applies fixed linear pools within pools correctly', () => {
    const map_a = datum => datum.a
    const map_b = datum => datum.b

    const { pooledData, pools } = usePooledData({
      data,
      pooling: [
        {
          mapData: map_a,
          pools: 4,
        },
        {
          mapData: map_b,
          pools: 2,
        },
      ],
    })

    const expectedPools = [
      {
        min: -6,
        max: -2,
        pools: [
          { min: 0, max: 10 },
          { min: 10, max: 20 },
        ],
      },
      {
        min: -2,
        max: 2,
        pools: [
          { min: 0, max: 10 },
          { min: 10, max: 20 },
        ],
      },
      {
        min: 2,
        max: 6,
        pools: [
          { min: 0, max: 10 },
          { min: 10, max: 20 },
        ],
      },
      {
        min: 6,
        max: 10,
        pools: [
          { min: 0, max: 10 },
          { min: 10, max: 20 },
        ],
      },
    ]
    expect(pools).toEqual(expectedPools)

    const expectedPooledData = [
      [0, 1],
      [4, 3],
      [9, 9],
      [2, 2],
    ]
    expect(pooledData).toEqual(expectedPooledData)
  })
})
