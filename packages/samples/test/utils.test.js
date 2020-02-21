'use strict'

const { test } = require('tap')

const { random, encodeNumToBin, decodeBinToNum } = require('../mock/utils')

test('Ensure random() in test gives consistent pseudorandom values', t => {
  const expected = [
    0.025,
    0.95,
    0.075,
    0.9,
    0.125,
    0.85,
    0.175,
    0.8,
    0.225,
    0.75,
    0.275,
    0.7,
    0.325,
    0.65,
    0.375,
    0.6,
    0.425,
    0.55,
    0.475,
    0.5,
    0.525,
    0.45,
    0.575,
    0.4,
    0.625,
    0.35,
    0.675,
    0.3,
    0.725,
    0.25,
    0.775,
    0.2,
    0.825,
    0.15,
    0.875,
    0.1,
    0.925,
    0.05,
    0.975,
  ]
  // Don't specify order, so execution order of tests doesn't matter
  while (expected.length) {
    const rand = random()

    // Remove floating point imprecision
    const rounded = Number(rand.toFixed(3))

    const index = expected.indexOf(rounded)
    if (index === -1) throw new Error(`Unexpected pseudorandom number ${rand}`)
    expected.splice(index)
  }
  t.same([], expected)
  t.end()
})

test('Encode and decode binary integers', t => {
  let i = 0
  while (i < 1000) {
    const bin = encodeNumToBin(i)
    t.type(bin, 'Buffer')
    t.equals(decodeBinToNum(bin), i)
    i++
  }
  t.end()
})
