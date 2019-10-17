const { test } = require('tap')

const {
  random,
  encodeNumToBin,
  decodeBinToNum,
} = require('../mock/utils')

test('Ensure random() in test gives consistent pseudorandom values', (t) => {
  const expected = [0.05, 0.9, 0.15, 0.8, 0.25, 0.7, 0.35, 0.6, 0.45, 0.5, 0.55, 0.4, 0.65, 0.3, 0.75, 0.2, 0.85, 0.1, 0.95]
  // Don't specify order, so execution order of tests doesn't matter
  while (expected.length) {
    const rand = random()

    // Remove floating point imprecision
    const rounded = Number(rand.toFixed(2))

    const index = expected.indexOf(rounded)
    if (index === -1) throw new Error(`Unexpected pseudorandom number ${rand}`)
    expected.splice(index)
  }
  t.same([], expected)
  t.end()
})

test('Encode and decode binary integers', (t) => {
  let i = 0
  while (i < 1000) {
    const bin = encodeNumToBin(i)
    t.type(bin, 'Buffer')
    t.equals(decodeBinToNum(bin), i)
    i++
  }
  t.end()
})
